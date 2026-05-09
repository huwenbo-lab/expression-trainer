function renderHighlightedText(text, highlights = []) {
  if (!Array.isArray(highlights) || highlights.length === 0) {
    return text
  }

  const parts = []
  let cursor = 0

  while (cursor < text.length) {
    let nextMatch = null

    for (const highlight of highlights) {
      const index = text.indexOf(highlight, cursor)
      if (index === -1) {
        continue
      }

      if (!nextMatch || index < nextMatch.index) {
        nextMatch = { highlight, index }
      }
    }

    if (!nextMatch) {
      parts.push(text.slice(cursor))
      break
    }

    if (nextMatch.index > cursor) {
      parts.push(text.slice(cursor, nextMatch.index))
    }

    parts.push(
      <strong key={`${nextMatch.highlight}-${nextMatch.index}`} className="font-semibold">
        {nextMatch.highlight}
      </strong>,
    )
    cursor = nextMatch.index + nextMatch.highlight.length
  }

  return parts
}

export default function ChatBubble({ line }) {
  const isYou = line.speaker === 'you'

  return (
    <div className={['max-w-[82%]', isYou ? 'ml-auto text-right' : 'mr-auto'].join(' ')}>
      <div
        className={[
          'border px-4 py-3 text-left shadow-sm',
          isYou
            ? 'border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-paper)]'
            : 'border-[var(--color-rule)] bg-[var(--color-paper)] text-[var(--color-ink)]',
        ].join(' ')}
      >
        <div className="mb-1 text-xs uppercase tracking-[0.14em] opacity-60">{line.speaker}</div>
        <p className="font-serif text-lg leading-7">{renderHighlightedText(line.en, line.highlights)}</p>
        {isYou && line.zh ? (
          <p className="mt-2 border-t border-white/20 pt-2 text-sm leading-5 text-[var(--color-bubble-muted)]">
            {line.zh}
          </p>
        ) : null}
      </div>
    </div>
  )
}
