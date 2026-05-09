import { useCallback, useState } from 'react'

export const FILTERS = {
  all: 'all',
  unmastered: 'unmastered',
  starred: 'starred',
}

const supportedFilters = new Set(Object.values(FILTERS))

export function isSupportedFilter(filter) {
  return supportedFilters.has(filter)
}

function cloneClusterWithExpressions(cluster, expressions) {
  return {
    ...cluster,
    expressions: [...expressions],
  }
}

export function filterClusters(clusters, mastered, starred, filter) {
  if (!Array.isArray(clusters)) {
    return []
  }

  if (filter === FILTERS.unmastered) {
    return clusters
      .map((cluster) =>
        cloneClusterWithExpressions(
          cluster,
          cluster.expressions.filter((expression) => !mastered.has(expression.id)),
        ),
      )
      .filter((cluster) => cluster.expressions.length > 0)
  }

  if (filter === FILTERS.starred) {
    return clusters
      .map((cluster) =>
        cloneClusterWithExpressions(
          cluster,
          cluster.expressions.filter((expression) => starred.has(expression.id)),
        ),
      )
      .filter((cluster) => cluster.expressions.length > 0)
  }

  return clusters.map((cluster) => cloneClusterWithExpressions(cluster, cluster.expressions))
}

export function useFilter(initialFilter = FILTERS.all) {
  const [filter, setFilterState] = useState(
    isSupportedFilter(initialFilter) ? initialFilter : FILTERS.all,
  )

  const setFilter = useCallback((nextFilter) => {
    setFilterState(isSupportedFilter(nextFilter) ? nextFilter : FILTERS.all)
  }, [])

  return {
    filter,
    setFilter,
    filterClusters,
  }
}
