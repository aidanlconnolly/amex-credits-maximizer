import type { StoredState } from '@/types'

const KEY = 'amex-credits.v1'

const DEFAULT_STATE: StoredState = {
  cards: [],
  creditStatus: {},
  enrolled: {},
  onboarded: false,
}

export function loadState(): StoredState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return DEFAULT_STATE
    return { ...DEFAULT_STATE, ...JSON.parse(raw) }
  } catch {
    return DEFAULT_STATE
  }
}

export function saveState(state: StoredState): void {
  localStorage.setItem(KEY, JSON.stringify(state))
}
