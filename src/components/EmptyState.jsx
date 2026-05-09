const emptyCopy = {
  all: '这个分类暂时没有表达。',
  unmastered: '这个过滤条件下没有未掌握表达。',
  starred: '这个过滤条件下没有已收藏表达。',
}

export default function EmptyState({ filter }) {
  return (
    <div className="border border-dashed border-[var(--color-rule)] px-5 py-12 text-center text-[var(--color-muted)]">
      {emptyCopy[filter] ?? emptyCopy.all}
    </div>
  )
}
