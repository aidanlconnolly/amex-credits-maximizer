import type { CardType, StoredState } from '@/types'
import { BENEFITS } from '@/data/benefits'
import { ROICalculator } from './ROICalculator'
import { EnrollmentAlert } from './EnrollmentAlert'
import { CreditSection } from './CreditSection'

interface Props {
  cards: CardType[]
  state: StoredState
  now: Date
  onToggle: (card: CardType, creditId: string, used: boolean) => void
  onEnroll: (creditId: string, enrolled: boolean) => void
  roi: ReturnType<typeof import('@/lib/credits').computeROI>
}

export function Dashboard({ cards, state, now, onToggle, onEnroll, roi }: Props) {
  // Collect all enrollment-required credits across active cards
  const enrollmentCredits = cards.flatMap((card) =>
    BENEFITS[card].credits.filter((c) => c.requiresEnrollment)
  )

  return (
    <div className="space-y-6">
      <ROICalculator roi={roi} />

      {enrollmentCredits.length > 0 && (
        <EnrollmentAlert
          credits={enrollmentCredits}
          enrolled={state.enrolled}
          onEnroll={(id, val) => onEnroll(id, val)}
        />
      )}

      {cards.map((card) => {
        const { credits } = BENEFITS[card]
        const monthly = credits.filter((c) => c.resetPeriod === 'monthly')
        const quarterly = credits.filter((c) => c.resetPeriod === 'quarterly')
        const semiannual = credits.filter((c) => c.resetPeriod === 'semiannual')
        const annual = credits.filter((c) => c.resetPeriod === 'annual')

        return (
          <div key={card}>
            <h2 className="font-display text-lg font-medium text-foreground mb-3 capitalize flex items-center gap-2">
              <span className={card === 'platinum' ? 'text-slate-300' : 'text-yellow-400'}>
                Amex {card.charAt(0).toUpperCase() + card.slice(1)}
              </span>
              <span className="text-xs text-muted-foreground font-sans font-normal">
                ${BENEFITS[card].annualFee}/yr
              </span>
            </h2>
            <div className="space-y-5">
              {monthly.length > 0 && (
                <CreditSection
                  title="Monthly"
                  credits={monthly}
                  card={card}
                  state={state}
                  now={now}
                  onToggle={onToggle}
                  onEnroll={(id) => onEnroll(id, true)}
                />
              )}
              {quarterly.length > 0 && (
                <CreditSection
                  title="Quarterly"
                  credits={quarterly}
                  card={card}
                  state={state}
                  now={now}
                  onToggle={onToggle}
                  onEnroll={(id) => onEnroll(id, true)}
                />
              )}
              {semiannual.length > 0 && (
                <CreditSection
                  title="Semi-Annual"
                  credits={semiannual}
                  card={card}
                  state={state}
                  now={now}
                  onToggle={onToggle}
                  onEnroll={(id) => onEnroll(id, true)}
                />
              )}
              {annual.length > 0 && (
                <CreditSection
                  title="Annual"
                  credits={annual}
                  card={card}
                  state={state}
                  now={now}
                  onToggle={onToggle}
                  onEnroll={(id) => onEnroll(id, true)}
                />
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
