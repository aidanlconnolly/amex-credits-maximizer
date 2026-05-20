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
}

export function CreditSection({ title, credits, card, state, now, onToggle, onEnroll }: Props) {
  if (credits.length === 0) return null

  const totalValue = credits.reduce((sum, c) => {
    const status = getCreditStatus(c, state, now)
    return sum + status.effectiveAmount
  }, 0)

  const usedCount = credits.filter((c) => getCreditStatus(c, state, now).used).length

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
          return (
            <CreditRow
              key={credit.id}
              credit={credit}
              status={status}
              accessible={accessible}
              onToggle={() => onToggle(card, credit.id, !status.used)}
              onEnroll={credit.requiresEnrollment ? () => onEnroll(credit.id) : undefined}
            />
          )
        })}
      </div>
    </div>
  )
}
