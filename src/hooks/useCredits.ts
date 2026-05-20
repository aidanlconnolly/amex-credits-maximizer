import { useState, useCallback, useMemo } from 'react'
import { loadState, saveState } from '@/lib/storage'
import {
  getCreditStatus,
  getNudgeCredits,
  computeROI,
  getPeriodKey,
} from '@/lib/credits'
import type { CardType, StoredState } from '@/types'
import { BENEFITS } from '@/data/benefits'

export function useCredits() {
  const [state, setState] = useState<StoredState>(() => loadState())
  const now = useMemo(() => new Date(), [])

  const update = useCallback((next: StoredState) => {
    setState(next)
    saveState(next)
  }, [])

  const setCards = useCallback(
    (cards: CardType[]) => update({ ...state, cards, onboarded: true }),
    [state, update]
  )

  const markUsed = useCallback(
    (card: CardType, creditId: string) => {
      const credit = BENEFITS[card].credits.find((c) => c.id === creditId)
      if (!credit) return
      const periodKey = getPeriodKey(credit, now)
      const next: StoredState = {
        ...state,
        creditStatus: {
          ...state.creditStatus,
          [periodKey]: {
            ...state.creditStatus[periodKey],
            [creditId]: { used: true, usedDate: now.toISOString() },
          },
        },
      }
      update(next)
    },
    [state, update, now]
  )

  const unmarkUsed = useCallback(
    (card: CardType, creditId: string) => {
      const credit = BENEFITS[card].credits.find((c) => c.id === creditId)
      if (!credit) return
      const periodKey = getPeriodKey(credit, now)
      const next: StoredState = {
        ...state,
        creditStatus: {
          ...state.creditStatus,
          [periodKey]: {
            ...state.creditStatus[periodKey],
            [creditId]: { used: false },
          },
        },
      }
      update(next)
    },
    [state, update, now]
  )

  const setEnrolled = useCallback(
    (creditId: string, enrolled: boolean) => {
      update({ ...state, enrolled: { ...state.enrolled, [creditId]: enrolled } })
    },
    [state, update]
  )

  const getStatus = useCallback(
    (card: CardType, creditId: string) => {
      const credit = BENEFITS[card].credits.find((c) => c.id === creditId)
      if (!credit) return null
      return getCreditStatus(credit, state, now)
    },
    [state, now]
  )

  const nudgeCredits = useMemo(
    () => getNudgeCredits(state.cards, state, now),
    [state, now]
  )

  const roiSummary = useMemo(
    () => computeROI(state.cards, state, now),
    [state, now]
  )

  return {
    state,
    now,
    setCards,
    markUsed,
    unmarkUsed,
    setEnrolled,
    getStatus,
    nudgeCredits,
    roiSummary,
  }
}
