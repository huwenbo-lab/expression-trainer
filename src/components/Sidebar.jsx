import CategoryItem from './CategoryItem'

export default function Sidebar({
  categories,
  selectedCategoryId,
  onSelectCategory,
  getMasteredCount,
  getTotalCount,
}) {
  return (
    <aside className="border-b border-[var(--color-rule)] bg-[var(--color-panel)] md:min-h-[calc(100vh-88px)] md:border-b-0">
      <div className="sticky top-0 p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
          Categories
        </p>
        <nav className="grid gap-2" aria-label="学术写作分类">
          {categories.map((category) => (
            <CategoryItem
              key={category.id}
              category={category}
              isSelected={category.id === selectedCategoryId}
              onSelect={() => onSelectCategory(category.id)}
              masteredCount={getMasteredCount(category)}
              totalCount={getTotalCount(category)}
            />
          ))}
        </nav>
      </div>
    </aside>
  )
}
