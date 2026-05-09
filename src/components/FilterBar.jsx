import { FILTERS } from '../hooks/useFilter'

const filterOptions = [
  { id: FILTERS.all, label: '全部' },
  { id: FILTERS.unmastered, label: '未掌握' },
  { id: FILTERS.starred, label: '已收藏' },
]

export default function FilterBar({ filter, setFilter, masteredCount, totalCount }) {
  return (
    <div className="sticky top-0 z-10 flex flex-col gap-3 border-b border-[var(--color-rule)] bg-[var(--color-paper)]/95 px-5 py-3 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-2" role="group" aria-label="表达过滤器">
        {filterOptions.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => setFilter(option.id)}
            className={[
              'border px-3 py-1.5 text-sm transition',
              filter === option.id
                ? 'border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-paper)]'
                : 'border-[var(--color-rule)] text-[var(--color-ink-soft)] hover:border-[var(--color-ink)]',
            ].join(' ')}
            aria-pressed={filter === option.id}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="text-sm text-[var(--color-ink-soft)]">
        进度: <span className="font-semibold text-[var(--color-ink)]">{masteredCount}</span>/
        {totalCount}
      </div>
    </div>
  )
}
