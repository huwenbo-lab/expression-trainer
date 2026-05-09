import { useMemo, useState } from 'react'

import { oralSceneGroups, oralScenes } from '../data'
import { useFilter } from '../hooks/useFilter'
import { useProgress } from '../hooks/useProgress'
import DialogueCard from './DialogueCard'
import FilterBar from './FilterBar'
import SceneSidebar from './SceneSidebar'
import UniversalExpressions from './UniversalExpressions'

export default function OralModule() {
  const [selectedSceneId, setSelectedSceneId] = useState(oralScenes[0]?.id)
  const progress = useProgress()
  const { filter, setFilter, filterClusters } = useFilter()

  const selectedScene = useMemo(
    () => oralScenes.find((scene) => scene.id === selectedSceneId) ?? oralScenes[0],
    [selectedSceneId],
  )

  const visibleClusters = useMemo(
    () =>
      filterClusters(
        selectedScene?.universalExpressions ?? [],
        progress.mastered,
        progress.starred,
        filter,
      ),
    [filter, filterClusters, progress.mastered, progress.starred, selectedScene],
  )

  const masteredCount = progress.getMasteredCount(selectedScene)
  const totalCount = progress.getTotalCount(selectedScene)

  return (
    <div className="bg-[var(--color-page)] text-[var(--color-ink)]">
      <main className="mx-auto grid max-w-7xl grid-cols-1 md:grid-cols-[280px_minmax(0,1fr)]">
        <SceneSidebar
          sceneGroups={oralSceneGroups}
          selectedSceneId={selectedScene.id}
          onSelectScene={setSelectedSceneId}
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
                {selectedScene.nameEn}
              </p>
              <h2 className="mt-1 font-serif text-3xl font-semibold text-[var(--color-ink)]">
                口语交流场景训练 · {selectedScene.name}
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--color-ink-soft)]">
                {selectedScene.description}
              </p>
            </div>

            <section className="grid gap-3">
              {selectedScene.dialogues.map((dialogue, index) => (
                <DialogueCard
                  key={dialogue.id}
                  dialogue={dialogue}
                  defaultOpen={index === 0}
                />
              ))}
            </section>

            <UniversalExpressions
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
