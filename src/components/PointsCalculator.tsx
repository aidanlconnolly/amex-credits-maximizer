import { useState } from 'react'
import { Calculator } from 'lucide-react'
import { cn } from '@/lib/utils'

function getScore(cpp: number): { score: number; label: string; color: string; bg: string } {
  if (cpp >= 2.0) return { score: 10, label: 'Exceptional — use points immediately', color: 'text-emerald-300', bg: 'bg-emerald-500/10 border-emerald-500/30' }
  if (cpp >= 1.7) return { score: 9, label: 'Great deal — strong redemption', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' }
  if (cpp >= 1.5) return { score: 8, label: 'Good deal — points are worth it', color: 'text-lime-400', bg: 'bg-lime-500/10 border-lime-500/20' }
  if (cpp >= 1.3) return { score: 7, label: 'Solid value — lean toward points', color: 'text-lime-500', bg: 'bg-lime-500/8 border-lime-500/15' }
  if (cpp >= 1.1) return { score: 6, label: 'Fair — close to baseline MR value', color: 'text-yellow-400', bg: 'bg-yellow-500/8 border-yellow-500/20' }
  if (cpp >= 1.0) return { score: 5, label: 'Borderline — consider paying cash', color: 'text-yellow-500', bg: 'bg-yellow-500/8 border-yellow-500/15' }
  if (cpp >= 0.8) return { score: 3, label: 'Below average — lean toward cash', color: 'text-orange-400', bg: 'bg-orange-500/8 border-orange-500/20' }
  return { score: 1, label: "Don't use points — terrible value", color: 'text-red-400', bg: 'bg-red-500/8 border-red-500/20' }
}

export function PointsCalculator() {
  const [dollars, setDollars] = useState('')
  const [points, setPoints] = useState('')
  const [type, setType] = useState<'flight' | 'hotel'>('flight')

  const dollarVal = parseFloat(dollars) || 0
  const pointsVal = parseFloat(points) || 0
  const cpp = dollarVal > 0 && pointsVal > 0 ? (dollarVal * 100) / pointsVal : null
  const result = cpp !== null ? getScore(cpp) : null

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 mb-5">
          <Calculator size={16} className="text-gold" />
          <h2 className="font-display text-base font-medium text-foreground">Points vs Cash Calculator</h2>
        </div>

        {/* Type toggle */}
        <div className="flex rounded-lg border border-border overflow-hidden mb-5">
          {(['flight', 'hotel'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={cn(
                'flex-1 py-2 text-sm font-medium capitalize transition-colors',
                type === t ? 'bg-gold text-black' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <label className="block text-xs text-muted-foreground mb-1.5">
              {type === 'flight' ? 'Flight' : 'Hotel'} value ($)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <input
                type="number"
                min="0"
                value={dollars}
                onChange={(e) => setDollars(e.target.value)}
                placeholder="500"
                className="w-full bg-secondary border border-border rounded-lg pl-7 pr-3 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-gold/60 transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1.5">Amex MR points required</label>
            <input
              type="number"
              min="0"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              placeholder="30000"
              className="w-full bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-gold/60 transition-colors"
            />
          </div>
        </div>

        {/* Result */}
        {result && cpp !== null ? (
          <div className={cn('rounded-xl border p-5 text-center transition-all', result.bg)}>
            <div className="flex items-baseline justify-center gap-1 mb-1">
              <span className={cn('text-6xl font-display font-semibold', result.color)}>{result.score}</span>
              <span className="text-muted-foreground text-lg">/10</span>
            </div>
            <p className={cn('font-medium mb-3', result.color)}>{result.label}</p>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <span>{cpp.toFixed(2)}¢ per point</span>
              <span>·</span>
              <span>${dollarVal.toLocaleString()} for {Number(points).toLocaleString()} pts</span>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-secondary/30 p-5 text-center">
            <p className="text-muted-foreground text-sm">Enter a dollar value and point cost above</p>
          </div>
        )}
      </div>

      {/* Reference guide */}
      <div className="rounded-xl border border-border bg-card p-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Reference Values</p>
        <div className="space-y-2 text-sm">
          {[
            { cpp: '< 0.8¢', score: '1–2', verdict: 'Terrible — pay cash', color: 'text-red-400' },
            { cpp: '0.8–1.0¢', score: '3–4', verdict: 'Below average', color: 'text-orange-400' },
            { cpp: '1.0–1.3¢', score: '5–6', verdict: 'Fair / baseline', color: 'text-yellow-400' },
            { cpp: '1.3–1.7¢', score: '7–8', verdict: 'Good deal', color: 'text-lime-400' },
            { cpp: '1.7–2.0¢', score: '9', verdict: 'Great deal', color: 'text-emerald-400' },
            { cpp: '> 2.0¢', score: '10', verdict: 'Exceptional', color: 'text-emerald-300' },
          ].map((row) => (
            <div key={row.cpp} className="flex items-center gap-3">
              <span className="text-muted-foreground w-20 shrink-0">{row.cpp}</span>
              <span className={cn('font-semibold w-8 shrink-0', row.color)}>{row.score}</span>
              <span className="text-muted-foreground">{row.verdict}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-border">
          Amex MR points are typically worth <strong className="text-foreground">1.5–2¢</strong> each via transfer partners (e.g. Delta, British Airways, Hilton). Cash redemptions via Amex Travel = 1¢/pt.
        </p>
      </div>
    </div>
  )
}
