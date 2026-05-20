import type { CardType } from '@/types'
import { cn } from '@/lib/utils'

interface Props {
  onSelect: (cards: CardType[]) => void
}

const OPTIONS: { cards: CardType[]; label: string; fee: string; desc: string }[] = [
  {
    cards: ['platinum'],
    label: 'Platinum',
    fee: '$695/yr',
    desc: 'Travel credits, airline fee, Fine Hotels, Saks, Equinox',
  },
  {
    cards: ['gold'],
    label: 'Gold',
    fee: '$250/yr',
    desc: 'Dining credits, Uber Cash, Dunkin\', Resy',
  },
  {
    cards: ['platinum', 'gold'],
    label: 'Both Cards',
    fee: '$945/yr',
    desc: 'All benefits from Platinum + Gold with cross-card optimizer',
  },
]

export function CardSelector({ onSelect }: Props) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 bg-background">
      <div className="max-w-2xl w-full text-center">
        <p className="text-sm tracking-widest uppercase text-gold mb-3 font-sans font-medium">American Express</p>
        <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-3">
          Credits Maximizer
        </h1>
        <p className="text-muted-foreground mb-12 text-base">
          Which card(s) do you hold?
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          {OPTIONS.map((opt) => (
            <button
              key={opt.label}
              onClick={() => onSelect(opt.cards)}
              className={cn(
                'group relative flex flex-col items-start p-6 rounded-xl border border-border',
                'bg-card hover:border-gold/60 hover:bg-card/80 transition-all duration-200',
                'text-left cursor-pointer'
              )}
            >
              <div className="w-full flex items-center justify-between mb-3">
                <span className="font-display text-lg font-medium text-foreground">{opt.label}</span>
                <span className="text-xs text-muted-foreground font-sans">{opt.fee}</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{opt.desc}</p>
              <div className="mt-4 h-px w-full bg-gold/20 group-hover:bg-gold/50 transition-colors" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
