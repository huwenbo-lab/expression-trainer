import { useMemo, useState } from 'react'

import { academicCategories } from '../data'
import { useFilter } from '../hooks/useFilter'
import { useProgress } from '../hooks/useProgress'
import ClusterList from './ClusterList'
import FilterBar from './FilterBar'
import Sidebar from './Sidebar'

export default function AcademicModule() {
  const [selectedCategoryId, setSelectedCategoryId] = useState(academicCategories[0]?.id)
  const progress = useProgress()
  const { filter, setFilter, filterClusters } = useFilter()

  const selectedCategory = useMemo(
    () =>
      academicCategories.find((category) => category.id === selectedCategoryId) ??
      academicCategories[0],
    [selectedCategoryId],
  )

  const visibleClusters = useMemo(
    () =>
      filterClusters(
        selectedCategory?.clusters ?? [],
        progress.mastered,
        progress.starred,
        filter,
      ),
    [filter, filterClusters, progress.mastered, progress.starred, selectedCategory],
  )

  const masteredCount = progress.getMasteredCount(selectedCategory)
  const totalCount = progress.getTotalCount(selectedCategory)

  return (
    <div className="bg-[var(--color-page)] text-[var(--color-ink)]">
      <main className="mx-auto grid max-w-7xl grid-cols-1 md:grid-cols-[280px_minmax(0,1fr)]">
        <Sidebar
          categories={academicCategories}
          selectedCategoryId={selectedCategory.id}
          onSelectCategory={setSelectedCategoryId}
          getMasteredCount={progress.getMasteredCount}
          getTotalCount={progress.getTotalCount}
        />

        <section className="min-h-[calc(100vh-88px)] border-[var(--color-rule)] bg-[var(--color-paper)] md:border-l">
          <FilterBar
            filter={filter}
            setFilter={setFilter}
            masteredCount={masteredCount}
            totalCount={totalCount}
          />

          <div className="px-5 py-5">
            <div className="mb-5 border-b border-[var(--color-rule)] pb-4">
              <p className="font-serif text-sm text-[var(--color-muted)]">
                {selectedCategory.nameEn}
              </p>
              <h2 className="mt-1 font-serif text-3xl font-semibold text-[var(--color-ink)]">
                学术写作表达训练 · {selectedCategory.name}
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--color-ink-soft)]">
                {selectedCategory.description}
              </p>
            </div>

            <ClusterList
              clusters={visibleClusters}
              mastered={progress.mastered}
              starred={progress.starred}
              toggleMastered={progress.toggleMastered}
              toggleStarred={progress.toggleStarred}
              filter={filter}
            />
          </div>
        </section>
      </main>
    </div>
  )
}
