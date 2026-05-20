import {
  format,
  endOfMonth,
  endOfYear,
  differenceInCalendarDays,
  startOfYear,
  startOfMonth,
  addMonths,
} from 'date-fns'
import type { Credit, CreditStatus, ResetPeriod, ROISummary, StoredState, CardType } from '@/types'
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
  if (credit.resetPeriod === 'semiannual') {
    const creditHalf = credit.period ?? (now.getMonth() < 6 ? 'H1' : 'H2')
    const currentHalf = now.getMonth() < 6 ? 'H1' : 'H2'
    const currentYear = now.getFullYear()
    const startYear = startDate.getFullYear()
    const startHalf = startDate.getMonth() < 6 ? 'H1' : 'H2'
    const periods: string[] = []
    for (let y = startYear; y <= currentYear; y++) {
      // Skip if card started in H2 but this credit is H1 — that year's H1 predates the card
      if (y === startYear && creditHalf === 'H1' && startHalf === 'H2') continue
      // Skip H2 of current year if we haven't reached July yet
      if (y === currentYear && creditHalf === 'H2' && currentHalf === 'H1') continue
      periods.push(`${y}-${creditHalf}`)
    }
    return periods
  }
  // annual: just current period
  return [getPeriodKey(credit, now)]
}

function formatPeriodLabel(key: string, resetPeriod: ResetPeriod, currentYear: number): string {
  if (resetPeriod === 'monthly') {
    const [yr, mo] = key.split('-').map(Number)
    const MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    return yr !== currentYear ? `${MON[mo - 1]} '${String(yr).slice(2)}` : MON[mo - 1]
  }
  if (resetPeriod === 'quarterly') {
    const [yr, q] = key.split('-')
    return parseInt(yr) !== currentYear ? `${q} '${yr.slice(2)}` : q
  }
  if (resetPeriod === 'semiannual') {
    const [yr, h] = key.split('-')
    return parseInt(yr) !== currentYear ? `${h} '${yr.slice(2)}` : h
  }
  return key
}

/** Returns past period labels for a credit (excludes current period — handled by main toggle). */
export function getPastPeriodLabels(
  credit: Credit,
  cardStartDate: string,
  now: Date
): Array<{ key: string; label: string }> {
  const [y, m] = cardStartDate.split('-').map(Number)
  const startDate = new Date(y, m - 1, 1)
  const allPeriods = getPeriodsFromStartToNow(credit, startDate, now)
  const currentKey = getPeriodKey(credit, now)
  const currentYear = now.getFullYear()
  return allPeriods
    .filter((key) => key !== currentKey)
    .map((key) => ({ key, label: formatPeriodLabel(key, credit.resetPeriod, currentYear) }))
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

  for (const card of cards) {
    const startStr = state.cardStartDates?.[card]
    const startDate = startStr
      ? new Date(parseInt(startStr.slice(0, 4)), parseInt(startStr.slice(5, 7)) - 1, 1)
      : startOfYear(date)

    for (const credit of BENEFITS[card].credits) {
      const periods = getPeriodsFromStartToNow(credit, startDate, date)
      for (const periodKey of periods) {
        if (state.creditStatus[periodKey]?.[credit.id]?.used) {
          const isDecUber = credit.id === 'uber_cash' && periodKey.endsWith('-12')
          usedSinceStart += isDecUber ? 35 : credit.amount
        }
      }
    }
  }

  return { annualFee, usedSinceStart }
}
