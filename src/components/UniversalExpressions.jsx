import ClusterList from './ClusterList'

export default function UniversalExpressions({
  clusters,
  mastered,
  starred,
  toggleMastered,
  toggleStarred,
  filter,
}) {
  return (
    <section className="mt-8 border-t border-[var(--color-rule)] pt-5">
      <div className="mb-4 flex items-baseline justify-between gap-4">
        <div>
          <p className="font-serif text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
            Reusable phrases
          </p>
          <h3 className="mt-1 font-serif text-xl font-semibold text-[var(--color-ink)]">
            万能表达
          </h3>
        </div>
      </div>

      <ClusterList
        clusters={clusters}
        mastered={mastered}
        starred={starred}
        toggleMastered={toggleMastered}
        toggleStarred={toggleStarred}
        filter={filter}
      />
    </section>
  )
}
