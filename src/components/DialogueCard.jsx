import { useState } from 'react'

import ChatBubble from './ChatBubble'

export default function DialogueCard({ dialogue, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <article className="border border-[var(--color-rule)] bg-[var(--color-page)]">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex w-full items-start justify-between gap-4 px-4 py-3 text-left"
        aria-expanded={isOpen}
      >
        <div>
          <h3 className="font-semibold text-[var(--color-ink)]">对话：{dialogue.title}</h3>
          <p className="mt-1 text-sm leading-5 text-[var(--color-ink-soft)]">
            {dialogue.context}
          </p>
        </div>
        <span className="mt-0.5 text-lg text-[var(--color-muted)]" aria-hidden="true">
          {isOpen ? '−' : '+'}
        </span>
      </button>

      {isOpen ? (
        <div className="grid gap-3 border-t border-[var(--color-rule)] px-4 py-4">
          {dialogue.lines.map((line, index) => (
            <ChatBubble key={`${dialogue.id}-${index}`} line={line} />
          ))}
        </div>
      ) : null}
    </article>
  )
}
