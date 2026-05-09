import { useCallback, useEffect, useMemo, useState } from 'react'

export const PROGRESS_STORAGE_KEY = 'expression-trainer-progress'

function getDefaultStorage() {
  if (typeof window === 'undefined') {
    return undefined
  }

  return window.localStorage
}

export function createEmptyProgress() {
  return {
    mastered: new Set(),
    starred: new Set(),
  }
}

function toStringSet(value) {
  if (!Array.isArray(value)) {
    return new Set()
  }

  return new Set(value.filter((item) => typeof item === 'string' && item.length > 0))
}

export function readStoredProgress(storage = getDefaultStorage()) {
  if (!storage) {
    return createEmptyProgress()
  }

  try {
    const stored = storage.getItem(PROGRESS_STORAGE_KEY)
    if (!stored) {
      return createEmptyProgress()
    }

    const parsed = JSON.parse(stored)

    return {
      mastered: toStringSet(parsed.mastered),
      starred: toStringSet(parsed.starred),
    }
  } catch {
    return createEmptyProgress()
  }
}

export function writeStoredProgress(storage = getDefaultStorage(), progress) {
  if (!storage) {
    return
  }

  storage.setItem(
    PROGRESS_STORAGE_KEY,
    JSON.stringify({
      mastered: [...progress.mastered],
      starred: [...progress.starred],
    }),
  )
}

export function toggleIdInSet(set, id) {
  const nextSet = new Set(set)

  if (nextSet.has(id)) {
    nextSet.delete(id)
  } else {
    nextSet.add(id)
  }

  return nextSet
}

function getExpressions(category) {
  const clusters = category?.clusters ?? category?.universalExpressions ?? []

  return clusters.flatMap((cluster) => cluster.expressions ?? [])
}

export function countTotalExpressions(category) {
  return getExpressions(category).length
}

export function countMasteredExpressions(category, mastered) {
  return getExpressions(category).filter((expression) => mastered.has(expression.id)).length
}

export function useProgress(storage = getDefaultStorage()) {
  const [progress, setProgress] = useState(() => readStoredProgress(storage))

  useEffect(() => {
    writeStoredProgress(storage, progress)
  }, [progress, storage])

  const toggleMastered = useCallback((id) => {
    setProgress((currentProgress) => ({
      ...currentProgress,
      mastered: toggleIdInSet(currentProgress.mastered, id),
    }))
  }, [])

  const toggleStarred = useCallback((id) => {
    setProgress((currentProgress) => ({
      ...currentProgress,
      starred: toggleIdInSet(currentProgress.starred, id),
    }))
  }, [])

  const getMasteredCount = useCallback(
    (category) => countMasteredExpressions(category, progress.mastered),
    [progress.mastered],
  )

  const getTotalCount = useCallback((category) => countTotalExpressions(category), [])

  return useMemo(
    () => ({
      mastered: progress.mastered,
      starred: progress.starred,
      toggleMastered,
      toggleStarred,
      getMasteredCount,
      getTotalCount,
    }),
    [getMasteredCount, getTotalCount, progress.mastered, progress.starred, toggleMastered, toggleStarred],
  )
}
