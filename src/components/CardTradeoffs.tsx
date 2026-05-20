import { cn } from '@/lib/utils'

const EARN_RATES = [
  { category: 'Flights (Amex Travel)', platinum: '5x MR', gold: '1x MR', winner: 'platinum' },
  { category: 'Hotels (Amex Travel)', platinum: '5x MR', gold: '1x MR', winner: 'platinum' },
  { category: 'Restaurants', platinum: '1x MR', gold: '4x MR', winner: 'gold' },
  { category: 'US Supermarkets', platinum: '1x MR', gold: '4x MR (up to $25k/yr)', winner: 'gold' },
  { category: 'US Gas Stations', platinum: '1x MR', gold: '1x MR', winner: 'tie' },
  { category: 'Everything else', platinum: '1x MR', gold: '1x MR', winner: 'tie' },
]

const KEY_CREDITS = [
  {
    label: 'Travel',
    items: [
      { card: 'Platinum', benefit: '$200 airline fee credit (select 1 carrier)' },
      { card: 'Platinum', benefit: '$200 Fine Hotels + Resorts (Amex Travel)' },
      { card: 'Platinum', benefit: '$199 CLEAR Plus credit' },
    ],
  },
  {
    label: 'Dining',
    items: [
      { card: 'Platinum', benefit: '$20/mo at Grubhub, Shake Shack & more' },
      { card: 'Platinum', benefit: '$100/quarter Resy credit ($400/year)' },
      { card: 'Gold', benefit: '$10/mo at Grubhub, Shake Shack & more' },
      { card: 'Gold', benefit: '$7/mo at Dunkin\'' },
      { card: 'Gold', benefit: '$50 semi-annual Resy credit ($100/year)' },
    ],
  },
  {
    label: 'Transport',
    items: [
      { card: 'Platinum', benefit: '$15/mo Uber Cash ($35 in Dec)' },
      { card: 'Gold', benefit: '$10/mo Uber Cash' },
    ],
  },
  {
    label: 'Lifestyle & Fitness',
    items: [
      { card: 'Platinum', benefit: '$300 Equinox / SoulCycle credit' },
      { card: 'Platinum', benefit: '$75/quarter lululemon credit ($300/year)' },
      { card: 'Platinum', benefit: '$155 Walmart+ membership' },
      { card: 'Platinum', benefit: '$50 semi-annual Saks Fifth Avenue' },
    ],
  },
]

export function CardTradeoffs() {
  return (
    <div className="space-y-6">
      {/* Earn rates */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="font-display text-base font-medium text-foreground mb-4">Earn Rates by Category</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-muted-foreground font-medium py-2 pr-4">Category</th>
                <th className="text-center text-muted-foreground font-medium py-2 px-4">Platinum</th>
                <th className="text-center text-muted-foreground font-medium py-2 px-4">Gold</th>
                <th className="text-center text-muted-foreground font-medium py-2 pl-4">Best</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {EARN_RATES.map((row) => (
                <tr key={row.category} className="hover:bg-secondary/30 transition-colors">
                  <td className="py-2.5 pr-4 text-foreground">{row.category}</td>
                  <td className={cn(
                    'py-2.5 px-4 text-center font-medium',
                    row.winner === 'platinum' ? 'text-slate-200' : 'text-muted-foreground'
                  )}>
                    {row.platinum}
                  </td>
                  <td className={cn(
                    'py-2.5 px-4 text-center font-medium',
                    row.winner === 'gold' ? 'text-yellow-400' : 'text-muted-foreground'
                  )}>
                    {row.gold}
                  </td>
                  <td className="py-2.5 pl-4 text-center">
                    {row.winner === 'platinum' && <span className="text-xs font-semibold text-slate-200 bg-slate-700/60 rounded px-2 py-0.5">Platinum</span>}
                    {row.winner === 'gold' && <span className="text-xs font-semibold text-yellow-400 bg-yellow-500/10 rounded px-2 py-0.5">Gold</span>}
                    {row.winner === 'tie' && <span className="text-xs text-muted-foreground">Tie</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          MR = Membership Rewards points. Transfer to airlines/hotels typically yields 1.5–2¢/pt.
        </p>
      </div>

      {/* Credits by category */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="font-display text-base font-medium text-foreground mb-4">Credits by Category</h2>
        <div className="grid md:grid-cols-2 gap-5">
          {KEY_CREDITS.map((group) => (
            <div key={group.label}>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">{group.label}</h3>
              <div className="space-y-1.5">
                {group.items.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span className={cn(
                      'shrink-0 text-xs font-semibold rounded px-1.5 py-0.5 mt-0.5',
                      item.card === 'Platinum'
                        ? 'text-slate-200 bg-slate-700/60'
                        : 'text-yellow-400 bg-yellow-500/10'
                    )}>
                      {item.card}
                    </span>
                    <span className="text-foreground">{item.benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rule of thumb */}
      <div className="rounded-xl border border-gold/20 bg-gold/5 p-4">
        <p className="text-sm text-foreground font-medium mb-1">Quick rule of thumb</p>
        <p className="text-sm text-muted-foreground">
          Use <span className="text-yellow-400 font-medium">Gold</span> for restaurants and groceries (4x).
          Use <span className="text-slate-200 font-medium">Platinum</span> for flights and hotels booked via Amex Travel (5x).
          Both cards give 1x on everything else — pick whichever has an active credit for that merchant.
        </p>
      </div>
    </div>
  )
}
