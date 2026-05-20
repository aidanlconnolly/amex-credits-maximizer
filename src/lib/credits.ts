import {
  format,
  endOfMonth,
  endOfYear,
  differenceInCalendarDays,
  startOfYear,
  startOfMonth,
  addMonths,
} from 'date-fns'
import type { Credit, CreditStatus, ROISummary, StoredState, CardType } from '@/types'
import { BENEFITS } from '@/data/benefits'

function getQuarter(date: Date): string {
  return `Q${Math.floor(date.getMonth() / 3) + 1}`
}

export function getPeriodKey(credit: Credit, date: Date): string {
  if (credit.resetPeriod === 'monthly') return format(date, 'yyyy-MM')
  if (credit.resetPeriod === 'quarterly') return `${date.getFullYear()}-${getQuarter(date)}`
  if (credit.resetPeriod === 'annual') return `${date.getFullYear()}-annual`
  // semiannual — use credit's period field if set (for fixed H1/H2 credits), else derive
  const half = credit.period ?? (date.getMonth() < 6 ? 'H1' : 'H2')
  return `${date.getFullYear()}-${half}`
}

export function getPeriodEnd(credit: Credit, date: Date): Date {
  if (credit.resetPeriod === 'monthly') return endOfMonth(date)
  if (credit.resetPeriod === 'quarterly') {
    const q = Math.floor(date.getMonth() / 3)
    // Last day of the quarter's last month
    const lastMonthOfQ = q * 3 + 2
    return new Date(date.getFullYear(), lastMonthOfQ + 1, 0, 23, 59, 59)
  }
  if (credit.resetPeriod === 'annual') return endOfYear(date)
  // semiannual
  const half = credit.period ?? (date.getMonth() < 6 ? 'H1' : 'H2')
  if (half === 'H1') return new Date(date.getFullYear(), 5, 30, 23, 59, 59)
  return new Date(date.getFullYear(), 11, 31, 23, 59, 59)
}

export function daysUntilReset(credit: Credit, date: Date): number {
  const end = getPeriodEnd(credit, date)
  return Math.max(0, differenceInCalendarDays(end, date))
}

export function getCountdownColor(days: number): string {
  if (days <= 5) return 'text-red-400'
  if (days <= 10) return 'text-yellow-400'
  return 'text-emerald-400'
}

export function getEffectiveAmount(credit: Credit, date: Date): number {
  if (credit.id === 'uber_cash' && date.getMonth() === 11) return 35
  return credit.amount
}

export function getCreditStatus(
  credit: Credit,
  state: StoredState,
  date: Date
): CreditStatus {
  const periodKey = getPeriodKey(credit, date)
  const used = state.creditStatus[periodKey]?.[credit.id]?.used ?? false
  const daysLeft = daysUntilReset(credit, date)
  return {
    used,
    daysLeft,
    colorClass: getCountdownColor(daysLeft),
    periodKey,
    effectiveAmount: getEffectiveAmount(credit, date),
  }
}

export function isCreditAccessible(credit: Credit, state: StoredState): boolean {
  if (!credit.requiresEnrollment) return true
  return state.enrolled[credit.id] === true
}

/** Returns all period keys for a credit from startDate up to and including the current period at `now`. */
export function getPeriodsFromStartToNow(credit: Credit, startDate: Date, now: Date): string[] {
  if (credit.resetPeriod === 'monthly') {
    const periods: string[] = []
    let d = startOfMonth(startDate)
    const current = startOfMonth(now)
    while (d <= current) {
      periods.push(format(d, 'yyyy-MM'))
      d = addMonths(d, 1)
    }
    return periods
  }
  if (credit.resetPeriod === 'quarterly') {
    const periods: string[] = []
    let year = startDate.getFullYear()
    let q = Math.floor(startDate.getMonth() / 3) + 1
    const nowYear = now.getFullYear()
    const nowQ = Math.floor(now.getMonth() / 3) + 1
    while (year < nowYear || (year === nowYear && q <= nowQ)) {
      periods.push(`${year}-Q${q}`)
      q++
      if (q > 4) { q = 1; year++ }
    }
    return periods
  }
  // annual / semiannual: just current period
  return [getPeriodKey(credit, now)]
}

export function getNudgeCredits(cards: CardType[], state: StoredState, date: Date) {
  const results: Array<{ credit: Credit; status: CreditStatus }> = []
  for (const card of cards) {
    for (const credit of BENEFITS[card].credits) {
      const status = getCreditStatus(credit, state, date)
      if (!status.used && status.daysLeft <= 11 && isCreditAccessible(credit, state)) {
        results.push({ credit, status })
      }
    }
  }
  return results.sort((a, b) => a.status.daysLeft - b.status.daysLeft)
}

export function computeROI(cards: CardType[], state: StoredState, date: Date): ROISummary {
  const annualFee = cards.reduce((sum, c) => sum + BENEFITS[c].annualFee, 0)

  let usedSinceStart = 0
  let totalPossible = 0

  for (const card of cards) {
    const startStr = state.cardStartDates?.[card]
    const startDate = startStr
      ? new Date(parseInt(startStr.slice(0, 4)), parseInt(startStr.slice(5, 7)) - 1, 1)
      : startOfYear(date)

    for (const credit of BENEFITS[card].credits) {
      totalPossible += getYearlyValue(credit, date)

      const periods = getPeriodsFromStartToNow(credit, startDate, date)
      for (const periodKey of periods) {
        if (state.creditStatus[periodKey]?.[credit.id]?.used) {
          // For Uber Cash December special: detect Dec from periodKey
          const isDecUber = credit.id === 'uber_cash' && periodKey.endsWith('-12')
          usedSinceStart += isDecUber ? 35 : credit.amount
        }
      }
    }
  }

  const netPosition = totalPossible - annualFee
  return { annualFee, usedSinceStart, totalPossible, netPosition }
}

function getYearlyValue(credit: Credit, _date: Date): number {
  if (credit.resetPeriod === 'monthly') {
    // Special: December uber_cash is $35, rest $15 → avg ~$15.83
    if (credit.id === 'uber_cash') return credit.amount * 11 + 35
    return credit.amount * 12
  }
  if (credit.resetPeriod === 'quarterly') return credit.amount * 4
  if (credit.resetPeriod === 'annual') return credit.amount
  // semiannual: only one half applies per H1/H2 credit
  return credit.amount
}
