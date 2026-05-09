import ExpressionRow from './ExpressionRow'

export default function ClusterItem({
  cluster,
  mastered,
  starred,
  toggleMastered,
  toggleStarred,
}) {
  return (
    <section className="border-l-2 border-[var(--color-rule)] pl-4">
      <header className="mb-2">
        <h3 className="text-lg font-semibold text-[var(--color-ink)]">{cluster.meaning}</h3>
        {cluster.tags?.length > 0 ? (
          <div className="mt-1 flex flex-wrap gap-1.5">
            {cluster.tags.map((tag) => (
              <span key={tag} className="text-xs text-[var(--color-muted)]">
                #{tag}
              </span>
            ))}
          </div>
        ) : null}
      </header>

      <div className="divide-y divide-[var(--color-rule)] border-y border-[var(--color-rule)]">
        {cluster.expressions.map((expression) => (
          <ExpressionRow
            key={expression.id}
            expression={expression}
            isMastered={mastered.has(expression.id)}
            isStarred={starred.has(expression.id)}
            mastered={mastered}
            starred={starred}
            toggleMastered={toggleMastered}
            toggleStarred={toggleStarred}
          />
        ))}
      </div>
    </section>
  )
}
