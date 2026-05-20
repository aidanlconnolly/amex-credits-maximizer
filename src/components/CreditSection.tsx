import { format, startOfMonth, addMonths } from 'date-fns'
import type { Credit, StoredState, CardType } from '@/types'
import { getCreditStatus, isCreditAccessible } from '@/lib/credits'
import { CreditRow } from './CreditRow'

interface Props {
  title: string
  credits: Credit[]
  card: CardType
  state: StoredState
  now: Date
  onToggle: (card: CardType, creditId: string, used: boolean) => void
  onEnroll: (creditId: string) => void
  cardStartDate?: string  // 'YYYY-MM'
  onTogglePeriod?: (card: CardType, creditId: string, periodKey: string, used: boolean) => void
  onMarkAllPeriods?: (card: CardType, creditId: string, periodKeys: string[], used: boolean) => void
}

function getPastMonths(cardStartDate: string, now: Date): Array<{ key: string; label: string }> {
  const [y, m] = cardStartDate.split('-').map(Number)
  const start = new Date(y, m - 1, 1)
  const current = startOfMonth(now)
  const nowYear = now.getFullYear()

  const months: Array<{ key: string; label: string }> = []
  let d = start
  while (d < current) {
    const key = format(d, 'yyyy-MM')
    const yr = d.getFullYear()
    const mon = format(d, 'MMM')
    const label = yr !== nowYear ? `${mon} '${String(yr).slice(2)}` : mon
    months.push({ key, label })
    d = addMonths(d, 1)
  }
  return months
}

export function CreditSection({
  title,
  credits,
  card,
  state,
  now,
  onToggle,
  onEnroll,
  cardStartDate,
  onTogglePeriod,
  onMarkAllPeriods,
}: Props) {
  if (credits.length === 0) return null

  const totalValue = credits.reduce((sum, c) => {
    const status = getCreditStatus(c, state, now)
    return sum + status.effectiveAmount
  }, 0)

  const usedCount = credits.filter((c) => getCreditStatus(c, state, now).used).length

  const pastMonths = cardStartDate ? getPastMonths(cardStartDate, now) : []

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{title}</h3>
        <span className="text-xs text-muted-foreground">
          {usedCount}/{credits.length} used · ${totalValue}/period
        </span>
      </div>
      <div className="space-y-2">
        {credits.map((credit) => {
          const status = getCreditStatus(credit, state, now)
          const accessible = isCreditAccessible(credit, state)

          let monthHistory: React.ComponentProps<typeof CreditRow>['monthHistory'] = undefined
          if (credit.resetPeriod === 'monthly' && pastMonths.length > 0 && onTogglePeriod && onMarkAllPeriods) {
            const usage: Record<string, boolean> = {}
            for (const { key } of pastMonths) {
              usage[key] = state.creditStatus[key]?.[credit.id]?.used ?? false
            }
            monthHistory = {
              periods: pastMonths,
              usage,
              onToggle: (key, used) => onTogglePeriod(card, credit.id, key, used),
              onMarkAll: () => onMarkAllPeriods(card, credit.id, pastMonths.map((p) => p.key), true),
            }
          }

          return (
            <CreditRow
              key={credit.id}
              credit={credit}
              status={status}
              accessible={accessible}
              onToggle={() => onToggle(card, credit.id, !status.used)}
              onEnroll={credit.requiresEnrollment ? () => onEnroll(credit.id) : undefined}
              monthHistory={monthHistory}
            />
          )
        })}
      </div>
    </div>
  )
}
