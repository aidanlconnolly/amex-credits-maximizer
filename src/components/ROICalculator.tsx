import type { ROISummary } from '@/types'
import { DollarSign } from 'lucide-react'
import { cn } from '@/lib/utils'

// ~2.0× blended MR earn (4× Gold dining/groceries, 5× Platinum flights, 1× everything else)
// × 1.8¢/pt conservative transfer-partner value
const BLENDED_RATE = 2.0
const POINT_VALUE_CENTS = 1.8

interface Props {
  roi: ROISummary
  totalSpend: number
  onSpendChange: (n: number) => void
}

export function ROICalculator({ roi, totalSpend, onSpendChange }: Props) {
  const { annualFee, usedSinceStart } = roi

  const estimatedPoints = Math.round(totalSpend * BLENDED_RATE)
  const estimatedValue = Math.round(totalSpend * BLENDED_RATE * (POINT_VALUE_CENTS / 100))

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4">
      {/* Annual summary */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <DollarSign size={15} className="text-gold" />
          <h2 className="font-display text-sm font-medium text-foreground">Annual</h2>
          <span className="text-xs text-muted-foreground">— fee ${annualFee.toLocaleString()}</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">Used Since Start</p>
            <p className="text-2xl font-semibold font-display text-gold">${usedSinceStart.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">Card Fees</p>
            <p className="text-2xl font-semibold font-display text-foreground">${annualFee.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Spend + points estimate */}
      <div className="border-t border-border pt-4">
        <div className="flex items-center gap-3 mb-2">
          <label className="text-xs text-muted-foreground whitespace-nowrap">Spend since start</label>
          <div className="relative flex-1 max-w-[160px]">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
            <input
              type="number"
              min="0"
              value={totalSpend || ''}
              onChange={(e) => onSpendChange(parseFloat(e.target.value) || 0)}
              placeholder="10000"
              className="w-full bg-secondary/40 border border-border rounded px-3 py-1.5 pl-6 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-gold/60 transition-colors"
            />
          </div>
        </div>
        {totalSpend > 0 ? (
          <p className="text-sm text-foreground">
            <span className="text-gold font-semibold">~{estimatedPoints.toLocaleString()} MR pts</span>
            <span className="text-muted-foreground"> ≈ </span>
            <span className={cn('font-semibold', estimatedValue > annualFee ? 'text-emerald-400' : 'text-foreground')}>
              ${estimatedValue.toLocaleString()}
            </span>
            <span className="text-muted-foreground text-xs ml-2">est. value</span>
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">Enter total spend to estimate MR points earned</p>
        )}
        <p className="text-xs text-muted-foreground/60 mt-1">
          {BLENDED_RATE}× blended (4× dining, 5× flights, 1× other) · {POINT_VALUE_CENTS}¢/pt transfer value
        </p>
      </div>
    </div>
  )
}
