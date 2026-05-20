import type { ROISummary } from '@/types'
import { DollarSign } from 'lucide-react'

// ~2.0× blended MR earn (4× Gold dining/groceries, 5× Platinum flights, 1× other)
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
  const estimatedPointsValue = Math.round(totalSpend * BLENDED_RATE * (POINT_VALUE_CENTS / 100))
  const totalEstSavings = usedSinceStart + estimatedPointsValue

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4">
      {/* Top stats */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <DollarSign size={15} className="text-gold" />
          <h2 className="font-display text-sm font-medium text-foreground">Annual</h2>
          <span className="text-xs text-muted-foreground">— fee ${annualFee.toLocaleString()}</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">Total Est. Savings</p>
            <p className="text-2xl font-semibold font-display text-gold">${totalEstSavings.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">Card Fees</p>
            <p className="text-2xl font-semibold font-display text-foreground">${annualFee.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Breakdown + spend input */}
      <div className="border-t border-border pt-4 space-y-3">
        {/* Breakdown row */}
        <div className="flex items-center gap-2 text-sm flex-wrap">
          <span className="text-muted-foreground">Credits</span>
          <span className="text-foreground font-medium">${usedSinceStart.toLocaleString()}</span>
          {estimatedPointsValue > 0 && (
            <>
              <span className="text-muted-foreground/50">+</span>
              <span className="text-muted-foreground">Points est.</span>
              <span className="text-foreground font-medium">
                ${estimatedPointsValue.toLocaleString()}
                <span className="text-muted-foreground font-normal text-xs ml-1">
                  (~{estimatedPoints.toLocaleString()} MR)
                </span>
              </span>
            </>
          )}
        </div>

        {/* Spend input */}
        <div className="flex items-center gap-3">
          <label className="text-xs text-muted-foreground whitespace-nowrap">Spend since start</label>
          <div className="relative max-w-[160px]">
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
        <p className="text-xs text-muted-foreground/60">
          {BLENDED_RATE}× blended (4× dining, 5× flights, 1× other) · {POINT_VALUE_CENTS}¢/pt transfer value
        </p>
      </div>
    </div>
  )
}
