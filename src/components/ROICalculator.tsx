import type { ROISummary } from '@/types'
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  roi: ROISummary
}

export function ROICalculator({ roi }: Props) {
  const { annualFee, usedYTD, totalPossible, netPosition, leavingOnTable } = roi
  const pctUsed = totalPossible > 0 ? Math.round((usedYTD / totalPossible) * 100) : 0

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <DollarSign size={16} className="text-gold" />
        <h2 className="font-display text-base font-medium text-foreground">Annual ROI</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <Stat label="Annual Fee" value={`$${annualFee}`} dim />
        <Stat label="Used YTD" value={`$${usedYTD}`} highlight />
        <Stat label="Total Possible" value={`$${totalPossible}`} />
        <Stat
          label="Net Position"
          value={`${netPosition >= 0 ? '+' : ''}$${netPosition}`}
          positive={netPosition >= 0}
        />
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>{pctUsed}% of credits used</span>
          <span>${usedYTD} / ${totalPossible}</span>
        </div>
        <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full rounded-full bg-gold transition-all duration-500"
            style={{ width: `${pctUsed}%` }}
          />
        </div>
      </div>

      {leavingOnTable > 0 && (
        <div className="flex items-center gap-2 text-sm text-red-400 mt-3">
          <TrendingDown size={14} />
          <span>Currently leaving <strong>${leavingOnTable}</strong> on the table this year</span>
        </div>
      )}
      {leavingOnTable === 0 && usedYTD > 0 && (
        <div className="flex items-center gap-2 text-sm text-emerald-400 mt-3">
          <TrendingUp size={14} />
          <span>All current credits used — great work!</span>
        </div>
      )}
    </div>
  )
}

function Stat({
  label,
  value,
  dim,
  highlight,
  positive,
}: {
  label: string
  value: string
  dim?: boolean
  highlight?: boolean
  positive?: boolean
}) {
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
      <p
        className={cn(
          'text-lg font-semibold font-display',
          dim && 'text-muted-foreground',
          highlight && 'text-gold',
          positive === true && 'text-emerald-400',
          positive === false && 'text-red-400',
          positive === undefined && !dim && !highlight && 'text-foreground'
        )}
      >
        {value}
      </p>
    </div>
  )
}
