export type CardType = 'platinum' | 'gold'
export type ResetPeriod = 'monthly' | 'quarterly' | 'annual' | 'semiannual'
export type SemiannualHalf = 'H1' | 'H2'

export interface Credit {
  id: string
  label: string
  amount: number
  resetPeriod: ResetPeriod
  period?: SemiannualHalf
  category: string
  note?: string
  eligibleMerchants?: string[]
  requiresEnrollment?: boolean
}

export interface CardBenefits {
  annualFee: number
  credits: Credit[]
}

export interface CreditUsageEntry {
  used: boolean
  usedDate?: string
}

export interface StoredState {
  cards: CardType[]
  creditStatus: Record<string, Record<string, CreditUsageEntry>>
  enrolled: Record<string, boolean>
  onboarded: boolean
  cardStartDates?: Record<string, string>  // CardType → 'YYYY-MM'
  totalSpend?: number
}

export interface CreditStatus {
  used: boolean
  daysLeft: number
  colorClass: string
  periodKey: string
  effectiveAmount: number
}

export interface ROISummary {
  annualFee: number
  usedSinceStart: number
}
