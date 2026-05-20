import type { ROISummary } from '@/types'
import { DollarSign } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  roi: ROISummary
}

export function ROICalculator({ roi }: Props) {
  const { annualFee, usedSinceStart, totalPossible, netPosition } = roi
  const pct = totalPossible > 0 ? Math.round((usedSinceStart / totalPossible) * 100) : 0

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 mb-3">
        <DollarSign size={15} className="text-gold" />
        <h2 className="font-display text-sm font-medium text-foreground">Annual</h2>
        <span className="text-xs text-muted-foreground">
          — fee ${annualFee}, net {netPosition >= 0 ? '+' : ''}${netPosition}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-3">
        <Stat label="Used Since Start" value={`$${usedSinceStart}`} highlight />
        <Stat label="Total Possible" value={`$${totalPossible}`} />
        <Stat
          label="Net Position"
          value={`${netPosition >= 0 ? '+' : ''}$${netPosition}`}
          positive={netPosition >= 0}
        />
      </div>
      <div>
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>{pct}% used</span>
          <span>${usedSinceStart} / ${totalPossible}</span>
        </div>
        <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full rounded-full bg-gold transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  )
}

function Stat({
  label,
  value,
  highlight,
  positive,
}: {
  label: string
  value: string
  highlight?: boolean
  positive?: boolean
}) {
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
      <p
        className={cn(
          'text-lg font-semibold font-display',
          highlight && 'text-gold',
          positive === true && 'text-emerald-400',
          positive === false && 'text-red-400',
          positive === undefined && !highlight && 'text-foreground'
        )}
      >
        {value}
      </p>
    </div>
  )
}
