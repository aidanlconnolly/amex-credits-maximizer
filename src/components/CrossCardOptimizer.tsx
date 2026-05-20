import { ArrowRight } from 'lucide-react'

const RULES: { merchant: string; card: string; reason: string }[] = [
  { merchant: 'Grubhub', card: 'Gold', reason: '4x + $10 dining credit' },
  { merchant: 'Shake Shack', card: 'Gold', reason: '4x dining + credit eligible' },
  { merchant: 'The Cheesecake Factory', card: 'Gold', reason: '4x dining + credit eligible' },
  { merchant: 'Milk Bar', card: 'Gold', reason: '4x dining + credit eligible' },
  { merchant: 'Goldbelly', card: 'Gold', reason: '4x dining + credit eligible' },
  { merchant: 'Wine.com', card: 'Gold', reason: '4x dining + credit eligible' },
  { merchant: 'Grocery stores', card: 'Gold', reason: '4x at US supermarkets' },
  { merchant: 'Restaurants', card: 'Gold', reason: '4x dining (vs 1x Platinum)' },
  { merchant: 'Flights (Amex Travel)', card: 'Platinum', reason: '5x MR points' },
  { merchant: 'Hotels (Amex Travel)', card: 'Platinum', reason: '5x MR + FHR $200 credit' },
  { merchant: 'Uber / Uber Eats', card: 'Both', reason: 'Platinum $15/mo + Gold $10/mo' },
  { merchant: 'Saks Fifth Avenue', card: 'Platinum', reason: '$50 credit per half-year' },
  { merchant: 'Equinox / SoulCycle', card: 'Platinum', reason: '$300 fitness credit' },
]

export function CrossCardOptimizer() {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h2 className="font-display text-base font-medium text-foreground mb-4">Where to Use Which Card</h2>
      <div className="space-y-1.5">
        {RULES.map((rule) => (
          <div key={rule.merchant} className="flex items-center gap-3 text-sm rounded-lg px-3 py-2 hover:bg-secondary/40 transition-colors">
            <span className="flex-1 text-foreground">{rule.merchant}</span>
            <ArrowRight size={13} className="text-muted-foreground shrink-0" />
            <span
              className={
                rule.card === 'Gold'
                  ? 'text-yellow-400 font-semibold w-24 text-right shrink-0'
                  : rule.card === 'Both'
                  ? 'text-gold font-semibold w-24 text-right shrink-0'
                  : 'text-slate-300 font-semibold w-24 text-right shrink-0'
              }
            >
              {rule.card}
            </span>
            <span className="text-xs text-muted-foreground w-40 text-right shrink-0 hidden md:block">{rule.reason}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
