import { AlertCircle } from 'lucide-react'
import type { Credit } from '@/types'

interface Props {
  credits: Credit[]
  enrolled: Record<string, boolean>
  onEnroll: (creditId: string, enrolled: boolean) => void
}

export function EnrollmentAlert({ credits, enrolled, onEnroll }: Props) {
  const unenrolled = credits.filter((c) => !enrolled[c.id])
  if (unenrolled.length === 0) return null

  return (
    <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-4">
      <div className="flex items-center gap-2 mb-3">
        <AlertCircle size={15} className="text-yellow-400" />
        <h3 className="text-sm font-medium text-yellow-300">
          {unenrolled.length} credit{unenrolled.length > 1 ? 's' : ''} require enrollment before use
        </h3>
      </div>
      <div className="space-y-2">
        {unenrolled.map((credit) => (
          <label key={credit.id} className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={!!enrolled[credit.id]}
              onChange={(e) => onEnroll(credit.id, e.target.checked)}
              className="w-4 h-4 rounded border-border accent-gold cursor-pointer"
            />
            <div>
              <span className="text-sm text-foreground">{credit.label}</span>
              {credit.note && (
                <span className="text-xs text-muted-foreground ml-2">{credit.note}</span>
              )}
            </div>
          </label>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-3">
        Check the box once you've enrolled via your Amex account. This unlocks the credit for tracking.
      </p>
    </div>
  )
}
