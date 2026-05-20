import type { ROISummary } from '@/types'
import { TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'

interface Props {
  roi: ROISummary
}

export function ROICalculator({ roi }: Props) {
  const { annualFee, usedYTD, totalPossible, netPosition, leavingOnTable, monthlyUsed, monthlyTotal } = roi
  const annualPct = totalPossible > 0 ? Math.round((usedYTD / totalPossible) * 100) : 0
  const monthlyPct = monthlyTotal > 0 ? Math.round((monthlyUsed / monthlyTotal) * 100) : 0
  const monthLabel = format(new Date(), 'MMMM')

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-5">
      {/* Annual section */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <DollarSign size={15} className="text-gold" />
          <h2 className="font-display text-sm font-medium text-foreground">Annual</h2>
          <span className="text-xs text-muted-foreground">— fee ${annualFee}, net {netPosition >= 0 ? '+' : ''}${netPosition}</span>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-3">
          <Stat label="Used YTD" value={`$${usedYTD}`} highlight />
          <Stat label="Total Possible" value={`$${totalPossible}`} />
          <Stat
            label="Net Position"
            value={`${netPosition >= 0 ? '+' : ''}$${netPosition}`}
            positive={netPosition >= 0}
          />
        </div>
        <div>
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>{annualPct}% used</span>
            <span>${usedYTD} / ${totalPossible}</span>
          </div>
          <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full rounded-full bg-gold transition-all duration-500"
              style={{ width: `${annualPct}%` }}
            />
          </div>
        </div>
      </div>

      <div className="border-t border-border" />

      {/* Monthly section */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Calendar size={15} className="text-gold" />
          <h2 className="font-display text-sm font-medium text-foreground">{monthLabel}</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-3">
          <Stat label="Used This Month" value={`$${monthlyUsed}`} highlight />
          <Stat label="Monthly Total" value={`$${monthlyTotal}`} />
        </div>
        <div>
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>{monthlyPct}% used</span>
            <span>${monthlyUsed} / ${monthlyTotal}</span>
          </div>
          <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full rounded-full bg-gold transition-all duration-500"
              style={{ width: `${monthlyPct}%` }}
            />
          </div>
        </div>
      </div>

      {leavingOnTable > 0 && (
        <div className="flex items-center gap-2 text-sm text-red-400 border-t border-border pt-4">
          <TrendingDown size={14} />
          <span>Leaving <strong>${leavingOnTable}</strong> on the table this year</span>
        </div>
      )}
      {leavingOnTable === 0 && usedYTD > 0 && (
        <div className="flex items-center gap-2 text-sm text-emerald-400 border-t border-border pt-4">
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
