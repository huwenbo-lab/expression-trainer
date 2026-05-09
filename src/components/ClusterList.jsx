import ClusterItem from './ClusterItem'
import EmptyState from './EmptyState'

export default function ClusterList({
  clusters,
  mastered,
  starred,
  toggleMastered,
  toggleStarred,
  filter,
}) {
  if (clusters.length === 0) {
    return <EmptyState filter={filter} />
  }

  return (
    <div className="grid gap-5">
      {clusters.map((cluster) => (
        <ClusterItem
          key={cluster.id}
          cluster={cluster}
          mastered={mastered}
          starred={starred}
          toggleMastered={toggleMastered}
          toggleStarred={toggleStarred}
        />
      ))}
    </div>
  )
}
