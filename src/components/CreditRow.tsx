import { Check, Clock, Lock } from 'lucide-react'
import type { Credit, CreditStatus } from '@/types'
import { cn } from '@/lib/utils'

interface MonthHistory {
  periods: Array<{ key: string; label: string }>  // past months (excludes current)
  usage: Record<string, boolean>
  onToggle: (periodKey: string, used: boolean) => void
  onMarkAll: () => void
}

interface Props {
  credit: Credit
  status: CreditStatus
  accessible: boolean
  onToggle: () => void
  onEnroll?: () => void
  monthHistory?: MonthHistory
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

export function CreditRow({ credit, status, accessible, onToggle, onEnroll, monthHistory }: Props) {
  const { used, daysLeft, colorClass, effectiveAmount } = status
  const locked = !accessible
  const hasPastMonths = monthHistory && monthHistory.periods.length > 0

  return (
    <div
      className={cn(
        'rounded-lg border transition-all duration-150',
        used
          ? 'border-emerald-500/20 bg-emerald-500/5 opacity-70'
          : 'border-border bg-card hover:border-border/80'
      )}
    >
      {/* Main row */}
      <div className="flex items-center gap-3 px-4 py-3">
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

      {/* Past month history */}
      {hasPastMonths && (
        <div className="px-4 pb-2.5 flex items-center gap-1.5 flex-wrap border-t border-border/40 pt-2">
          <span className="text-xs text-muted-foreground mr-0.5">Past:</span>
          {monthHistory!.periods.map(({ key, label }) => {
            const isUsed = monthHistory!.usage[key] ?? false
            return (
              <button
                key={key}
                onClick={() => monthHistory!.onToggle(key, !isUsed)}
                className={cn(
                  'text-xs px-1.5 py-0.5 rounded font-medium transition-colors',
                  isUsed
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-secondary/60 text-muted-foreground hover:text-foreground'
                )}
                title={isUsed ? `Unmark ${label}` : `Mark ${label} as used`}
              >
                {label}
              </button>
            )
          })}
          <button
            onClick={monthHistory!.onMarkAll}
            className="text-xs px-1.5 py-0.5 rounded font-medium bg-secondary/40 text-muted-foreground hover:text-foreground transition-colors ml-0.5"
            title="Mark all past months as used"
          >
            All ✓
          </button>
        </div>
      )}
    </div>
  )
}
