function getProgressPercent(masteredCount, totalCount) {
  if (totalCount === 0) {
    return 0
  }

  return Math.round((masteredCount / totalCount) * 100)
}

export default function CategoryItem({
  category,
  isSelected,
  onSelect,
  masteredCount,
  totalCount,
}) {
  const progressPercent = getProgressPercent(masteredCount, totalCount)
  const isComplete = totalCount > 0 && masteredCount === totalCount

  return (
    <button
      type="button"
      onClick={onSelect}
      className={[
        'group w-full border px-3 py-3 text-left transition',
        isSelected
          ? 'border-[var(--color-ink)] bg-[var(--color-paper)] text-[var(--color-ink)] shadow-sm'
          : 'border-transparent text-[var(--color-ink-soft)] hover:border-[var(--color-rule)] hover:bg-[var(--color-paper)]',
      ].join(' ')}
      aria-current={isSelected ? 'page' : undefined}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-medium leading-5">{category.name}</div>
          <div className="mt-0.5 font-serif text-xs leading-4 text-[var(--color-muted)]">
            {category.nameEn}
          </div>
        </div>
        <div className="shrink-0 text-xs text-[var(--color-muted)]">
          {isComplete ? '✓' : `${masteredCount}/${totalCount}`}
        </div>
      </div>

      <div className="mt-2 h-1.5 overflow-hidden bg-[var(--color-track)]" aria-hidden="true">
        <div
          className="h-full bg-gradient-to-r from-[var(--color-progress-warm)] via-[var(--color-progress-mid)] to-[var(--color-progress-cool)]"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </button>
  )
}
