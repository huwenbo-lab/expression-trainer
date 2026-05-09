export default function ExpressionRow({
  expression,
  isMastered,
  isStarred,
  mastered,
  starred,
  toggleMastered,
  toggleStarred,
}) {
  const masteredActive = isMastered ?? mastered.has(expression.id)
  const starredActive = isStarred ?? starred.has(expression.id)

  return (
    <article
      className={[
        'grid grid-cols-[minmax(0,1fr)_auto] gap-3 py-3 transition',
        masteredActive ? 'opacity-40' : 'opacity-100',
      ].join(' ')}
    >
      <div className="min-w-0">
        <div className="flex items-baseline gap-2">
          {starredActive ? (
            <span className="text-[var(--color-gold)]">★</span>
          ) : (
            <span className="text-[var(--color-rule)]">•</span>
          )}
          <p className="font-serif text-xl leading-6 text-[var(--color-ink)]">{expression.en}</p>
          {expression.register ? (
            <span className="text-xs text-[var(--color-muted)]">{expression.register}</span>
          ) : null}
        </div>
        <p className="mt-1 pl-6 text-sm leading-5 text-[var(--color-ink-soft)]">
          {expression.note}
        </p>
        {expression.example ? (
          <p className="mt-1 pl-6 font-serif text-sm italic leading-5 text-[var(--color-muted)]">
            {expression.example}
          </p>
        ) : null}
      </div>

      <div className="flex items-start gap-1">
        <button
          type="button"
          onClick={() => toggleMastered(expression.id)}
          className={[
            'h-8 w-8 border text-sm transition',
            masteredActive
              ? 'border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-paper)]'
              : 'border-[var(--color-rule)] text-[var(--color-ink-soft)] hover:border-[var(--color-ink)]',
          ].join(' ')}
          aria-label={`标记已掌握：${expression.en}`}
          aria-pressed={masteredActive}
          title="标记已掌握"
        >
          ✓
        </button>
        <button
          type="button"
          onClick={() => toggleStarred(expression.id)}
          className={[
            'h-8 w-8 border text-sm transition',
            starredActive
              ? 'border-[var(--color-gold)] bg-[var(--color-star-bg)] text-[var(--color-ink)]'
              : 'border-[var(--color-rule)] text-[var(--color-ink-soft)] hover:border-[var(--color-gold)]',
          ].join(' ')}
          aria-label={`收藏表达：${expression.en}`}
          aria-pressed={starredActive}
          title="收藏"
        >
          ★
        </button>
      </div>
    </article>
  )
}
