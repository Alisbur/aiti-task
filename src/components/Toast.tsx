import { useEffect } from 'react'

export type ToastItem = {
  id: string
  message: string
}

export function ToastHost({
  items,
  onDismiss,
}: {
  items: ToastItem[]
  onDismiss: (id: string) => void
}) {
  useEffect(() => {
    const timers = items.map((t) =>
      window.setTimeout(() => onDismiss(t.id), 3000)
    )
    return () => {
      for (const timer of timers) window.clearTimeout(timer)
    }
  }, [items, onDismiss])

  return (
    <div className="fixed bottom-4 right-4 z-50 flex w-full max-w-sm flex-col gap-2">
      {items.map((t) => (
        <div
          key={t.id}
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm"
          role="status"
          aria-live="polite"
        >
          {t.message}
        </div>
      ))}
    </div>
  )
}
