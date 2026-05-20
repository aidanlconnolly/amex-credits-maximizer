import { useState } from 'react'
import { X, AlertTriangle } from 'lucide-react'
import { format, endOfMonth } from 'date-fns'
import type { Credit, CreditStatus } from '@/types'

interface Props {
  nudgeCredits: Array<{ credit: Credit; status: CreditStatus }>
  now: Date
}

export function NudgeBar({ nudgeCredits, now }: Props) {
  const [dismissed, setDismissed] = useState(() => {
    return sessionStorage.getItem('nudge-dismissed') === '1'
  })

  if (dismissed || nudgeCredits.length === 0) return null

  const totalAtRisk = nudgeCredits.reduce((sum, { status }) => sum + status.effectiveAmount, 0)
  const minDays = nudgeCredits[0]?.status.daysLeft ?? 0
  const periodEnd = endOfMonth(now)

  const dismiss = () => {
    sessionStorage.setItem('nudge-dismissed', '1')
    setDismissed(true)
  }

  return (
    <div className="sticky top-0 z-50 bg-gold text-black px-4 py-2.5 flex items-center gap-3">
      <AlertTriangle size={16} className="shrink-0" />
      <div className="flex-1 text-sm font-medium">
        <span className="font-semibold">{minDays} day{minDays !== 1 ? 's' : ''} left in {format(now, 'MMMM')}</span>
        {' — '}
        <span>${totalAtRisk} unused</span>
        {' ('}
        {nudgeCredits.map(({ credit, status }, i) => (
          <span key={credit.id}>
            {i > 0 ? ' + ' : ''}{credit.label} ${status.effectiveAmount}
          </span>
        ))}
        {') '}
        <span className="opacity-70">· expires {format(periodEnd, 'MMM d')}</span>
      </div>
      <button onClick={dismiss} className="shrink-0 hover:opacity-70 transition-opacity">
        <X size={16} />
      </button>
    </div>
  )
}
