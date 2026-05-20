import { useState } from 'react'
import { useCredits } from '@/hooks/useCredits'
import { CardSelector } from '@/components/CardSelector'
import { Dashboard } from '@/components/Dashboard'
import { CardTradeoffs } from '@/components/CardTradeoffs'
import { CrossCardOptimizer } from '@/components/CrossCardOptimizer'
import { PointsCalculator } from '@/components/PointsCalculator'
import { cn } from '@/lib/utils'
import type { CardType } from '@/types'
import { BENEFITS } from '@/data/benefits'

type Tab = 'credits' | 'guide' | 'points' | 'settings'

const TABS: { id: Tab; label: string }[] = [
  { id: 'credits', label: 'Credits' },
  { id: 'guide', label: 'Card Guide' },
  { id: 'points', label: 'Points Calculator' },
  { id: 'settings', label: 'Settings' },
]

export default function App() {
  const {
    state,
    now,
    setCards,
    setTotalSpend,
    setCardStartDate,
    markUsed,
    unmarkUsed,
    markUsedForPeriod,
    markAllPeriods,
    setEnrolled,
    roiSummary,
  } = useCredits()
  const [tab, setTab] = useState<Tab>('credits')

  if (!state.onboarded) {
    return <CardSelector onSelect={setCards} />
  }

  const handleToggle = (card: CardType, creditId: string, used: boolean) => {
    if (used) markUsed(card, creditId)
    else unmarkUsed(card, creditId)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border px-4 md:px-8 py-5">
        <div className="max-w-3xl mx-auto flex items-baseline justify-between">
          <div>
            <p className="text-xs tracking-widest uppercase text-gold font-medium mb-0.5">American Express</p>
            <h1 className="font-display text-2xl font-semibold text-foreground">Credits Maximizer</h1>
          </div>
          <div className="flex gap-1.5">
            {state.cards.map((card) => (
              <span
                key={card}
                className={cn(
                  'text-xs font-medium rounded px-2 py-1',
                  card === 'platinum' ? 'bg-slate-700/60 text-slate-200' : 'bg-yellow-500/10 text-yellow-400'
                )}
              >
                {card.charAt(0).toUpperCase() + card.slice(1)}
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* Tab nav */}
      <nav className="border-b border-border px-4 md:px-8">
        <div className="max-w-3xl mx-auto flex gap-1 -mb-px overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                'px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors',
                tab === t.id
                  ? 'border-gold text-gold'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 md:px-8 py-6">
        {tab === 'credits' && (
          <Dashboard
            cards={state.cards}
            state={state}
            now={now}
            onToggle={handleToggle}
            onEnroll={setEnrolled}
            onTogglePeriod={markUsedForPeriod}
            onMarkAllPeriods={markAllPeriods}
            roi={roiSummary}
            totalSpend={state.totalSpend ?? 0}
            onSpendChange={setTotalSpend}
          />
        )}

        {tab === 'guide' && (
          <div className="space-y-6">
            <CardTradeoffs />
            {state.cards.length === 2 && <CrossCardOptimizer />}
          </div>
        )}

        {tab === 'points' && <PointsCalculator />}

        {tab === 'settings' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-lg font-medium text-foreground mb-1">Card Start Dates</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Set the month you opened each card. The annual summary counts credits from this date.
              </p>
              <div className="space-y-3">
                {state.cards.map((card) => (
                  <div key={card} className="flex items-center gap-4 rounded-lg border border-border bg-card px-4 py-3">
                    <span className={cn(
                      'text-sm font-medium min-w-[80px]',
                      card === 'platinum' ? 'text-slate-300' : 'text-yellow-400'
                    )}>
                      {card.charAt(0).toUpperCase() + card.slice(1)}
                      <span className="block text-xs text-muted-foreground font-normal">${BENEFITS[card].annualFee}/yr</span>
                    </span>
                    <input
                      type="month"
                      value={state.cardStartDates?.[card] ?? ''}
                      onChange={(e) => setCardStartDate(card, e.target.value)}
                      className="flex-1 bg-secondary/40 border border-border rounded px-3 py-1.5 text-sm text-foreground focus:outline-none focus:border-gold/60 [color-scheme:dark]"
                      max={`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <h2 className="font-display text-lg font-medium text-foreground mb-1">Your Cards</h2>
              <p className="text-sm text-muted-foreground mb-4">Update which Amex cards you hold.</p>
              <CardSelector onSelect={setCards} />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
