const navItems = [
  {
    id: 'academic',
    label: '学术写作',
    description: 'Academic Writing',
  },
  {
    id: 'oral',
    label: '口语交流',
    description: 'Oral Communication',
  },
]

export default function TopNav({ activeModule, onChangeModule }) {
  return (
    <header className="border-b border-[var(--color-rule)] bg-[var(--color-paper)]/95 px-5 py-4">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
            Expression Trainer
          </p>
          <h1 className="mt-1 font-serif text-3xl font-semibold leading-tight text-[var(--color-ink)]">
            英文表达训练网站
          </h1>
        </div>

        <nav className="flex border border-[var(--color-rule)] bg-[var(--color-page)]" aria-label="模块切换">
          {navItems.map((item) => {
            const isActive = item.id === activeModule

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onChangeModule(item.id)}
                className={[
                  'min-w-28 border-r border-[var(--color-rule)] px-4 py-2 text-left text-sm transition last:border-r-0',
                  isActive
                    ? 'bg-[var(--color-ink)] text-[var(--color-paper)]'
                    : 'text-[var(--color-ink-soft)] hover:bg-[var(--color-paper)]',
                ].join(' ')}
                aria-pressed={isActive}
              >
                <span className="block font-medium">{item.label}</span>
                <span className="block text-xs opacity-70">{item.description}</span>
              </button>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
