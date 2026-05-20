import { Check, Clock, Lock } from 'lucide-react'
import type { Credit, CreditStatus } from '@/types'
import { cn } from '@/lib/utils'

interface Props {
  credit: Credit
  status: CreditStatus
  accessible: boolean
  onToggle: () => void
  onEnroll?: () => void
}

const CATEGORY_COLORS: Record<string, string> = {
  transport: 'bg-blue-500/15 text-blue-300',
  dining: 'bg-orange-500/15 text-orange-300',
  entertainment: 'bg-purple-500/15 text-purple-300',
  travel: 'bg-sky-500/15 text-sky-300',
  lifestyle: 'bg-teal-500/15 text-teal-300',
  fitness: 'bg-emerald-500/15 text-emerald-300',
  shopping: 'bg-pink-500/15 text-pink-300',
}

export function CreditRow({ credit, status, accessible, onToggle, onEnroll }: Props) {
  const { used, daysLeft, colorClass, effectiveAmount } = status
  const locked = !accessible

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-lg border px-4 py-3 transition-all duration-150',
        used
          ? 'border-emerald-500/20 bg-emerald-500/5 opacity-70'
          : 'border-border bg-card hover:border-border/80'
      )}
    >
      {/* Toggle button */}
      <button
        onClick={locked ? onEnroll : onToggle}
        disabled={locked && !onEnroll}
        className={cn(
          'shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-150',
          used
            ? 'border-emerald-500 bg-emerald-500 text-black'
            : locked
            ? 'border-border/50 bg-transparent text-muted-foreground cursor-not-allowed'
            : 'border-border hover:border-gold/60 bg-transparent text-transparent hover:text-gold/40'
        )}
        title={locked ? 'Enrollment required' : used ? 'Mark as unused' : 'Mark as used'}
      >
        {used ? <Check size={13} strokeWidth={3} /> : locked ? <Lock size={11} /> : <Check size={13} />}
      </button>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={cn('text-sm font-medium', used && 'line-through text-muted-foreground')}>
            {credit.label}
          </span>
          <span className={cn('text-xs px-1.5 py-0.5 rounded font-medium', CATEGORY_COLORS[credit.category] ?? 'bg-secondary text-secondary-foreground')}>
            {credit.category}
          </span>
          {locked && (
            <span className="text-xs text-yellow-400 font-medium">needs enrollment</span>
          )}
        </div>
        {credit.eligibleMerchants && !used && (
          <div className="flex gap-1 flex-wrap mt-1">
            {credit.eligibleMerchants.map((m) => (
              <span key={m} className="text-xs text-muted-foreground bg-secondary/60 rounded px-1.5 py-0.5">
                {m}
              </span>
            ))}
          </div>
        )}
        {credit.note && !used && (
          <p className="text-xs text-muted-foreground mt-0.5">{credit.note}</p>
        )}
      </div>

      {/* Amount + countdown */}
      <div className="shrink-0 text-right">
        <p className={cn('text-base font-semibold font-display', used ? 'text-muted-foreground' : 'text-gold')}>
          ${effectiveAmount}
        </p>
        {!used && (
          <div className={cn('flex items-center gap-1 text-xs justify-end', colorClass)}>
            <Clock size={11} />
            <span>{daysLeft}d left</span>
          </div>
        )}
        {used && (
          <p className="text-xs text-emerald-500">Used ✓</p>
        )}
      </div>
    </div>
  )
}
