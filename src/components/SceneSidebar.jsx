function getProgressPercent(masteredCount, totalCount) {
  if (totalCount === 0) {
    return 0
  }

  return Math.round((masteredCount / totalCount) * 100)
}

export default function SceneSidebar({
  sceneGroups,
  selectedSceneId,
  onSelectScene,
  getMasteredCount,
  getTotalCount,
}) {
  return (
    <aside className="border-b border-[var(--color-rule)] bg-[var(--color-panel)] md:min-h-[calc(100vh-88px)] md:border-b-0">
      <div className="sticky top-0 grid gap-5 p-4">
        {sceneGroups.map((group) => (
          <section key={group.id}>
            <div className="mb-2">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                ◆ {group.name}
              </p>
              <p className="mt-0.5 text-xs text-[var(--color-muted)]">{group.nameEn}</p>
            </div>

            <nav className="grid gap-1.5" aria-label={`${group.name}场景`}>
              {group.scenes.map((scene) => {
                const masteredCount = getMasteredCount(scene)
                const totalCount = getTotalCount(scene)
                const progressPercent = getProgressPercent(masteredCount, totalCount)
                const isSelected = scene.id === selectedSceneId

                return (
                  <button
                    key={scene.id}
                    type="button"
                    onClick={() => onSelectScene(scene.id)}
                    className={[
                      'w-full border px-3 py-2.5 text-left transition',
                      isSelected
                        ? 'border-[var(--color-ink)] bg-[var(--color-paper)] text-[var(--color-ink)] shadow-sm'
                        : 'border-transparent text-[var(--color-ink-soft)] hover:border-[var(--color-rule)] hover:bg-[var(--color-paper)]',
                    ].join(' ')}
                    aria-current={isSelected ? 'page' : undefined}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-medium leading-5">{scene.name}</div>
                        <div className="mt-0.5 text-xs leading-4 text-[var(--color-muted)]">
                          {scene.nameEn}
                        </div>
                      </div>
                      <div className="shrink-0 text-xs text-[var(--color-muted)]">
                        {masteredCount}/{totalCount}
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
              })}
            </nav>
          </section>
        ))}
      </div>
    </aside>
  )
}
