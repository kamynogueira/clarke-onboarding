import { createContext, useCallback, useContext, useState, ReactNode } from 'react'
import clsx from 'clsx'
import { X, CheckCircle } from 'lucide-react'

interface SnackbarOptions {
  message: string
  type?: 'default' | 'action'
  actionLabel?: string
  onAction?: () => void
  duration?: number
}

interface SnackbarContextValue {
  show: (options: SnackbarOptions) => void
}

const SnackbarContext = createContext<SnackbarContextValue | null>(null)

export function SnackbarProvider({ children }: { children: ReactNode }) {
  const [snackbar, setSnackbar] = useState<(SnackbarOptions & { id: number }) | null>(null)

  const show = useCallback((options: SnackbarOptions) => {
    const id = Date.now()
    setSnackbar({ ...options, id })
    const duration = options.duration ?? 5000
    if (duration > 0) {
      setTimeout(() => setSnackbar((prev) => (prev?.id === id ? null : prev)), duration)
    }
  }, [])

  const close = () => setSnackbar(null)

  return (
    <SnackbarContext.Provider value={{ show }}>
      {children}
      {snackbar && (
        <div
          role={snackbar.type === 'default' ? 'status' : 'alert'}
          aria-live="polite"
          className={clsx(
            'fixed bottom-6 left-1/2 -translate-x-1/2 z-[var(--z-snackbar)]',
            'inline-flex items-center gap-3 px-4 py-3',
            'rounded-[var(--radius-pill)] bg-[var(--color-surface-default)]',
            'shadow-[var(--shadow-elevation)] w-full max-w-[480px] mx-4',
            'animate-[snackbar-in_300ms_ease_forwards]',
          )}
          style={{
            animation: 'snackbar-in 300ms ease forwards',
          }}
        >
          <style>{`
            @keyframes snackbar-in {
              from { opacity: 0; transform: translateX(-50%) translateY(16px); }
              to   { opacity: 1; transform: translateX(-50%) translateY(0); }
            }
          `}</style>

          <div className="w-6 h-6 rounded-full border-2 border-[var(--color-green-500)] flex items-center justify-center flex-shrink-0 text-[var(--color-green-500)]">
            <CheckCircle size={12} />
          </div>

          <p className="flex-1 text-[12px] text-[var(--color-text-primary)] leading-[1.4] font-[var(--font-family-base)]">
            {snackbar.message}
          </p>

          {snackbar.type === 'action' && snackbar.actionLabel && (
            <button
              onClick={() => { snackbar.onAction?.(); close() }}
              className={clsx(
                'bg-transparent border border-[var(--color-border-default)]',
                'text-[var(--color-text-secondary)] px-3 py-1.5',
                'rounded-[var(--radius-pill)] text-[12px] cursor-pointer flex-shrink-0',
                'hover:bg-[var(--color-surface-muted)] transition-colors',
                'font-[var(--font-family-base)]',
              )}
            >
              {snackbar.actionLabel}
            </button>
          )}

          <button
            onClick={close}
            aria-label="Fechar notificação"
            className={clsx(
              'w-7 h-7 rounded-full border border-[var(--color-border-default)]',
              'bg-transparent flex items-center justify-center cursor-pointer flex-shrink-0',
              'text-[var(--color-text-secondary)]',
              'hover:bg-[var(--color-surface-muted)] transition-colors',
              'focus-visible:outline-none focus-visible:shadow-[var(--effect-focus-gray)]',
            )}
          >
            <X size={14} />
          </button>
        </div>
      )}
    </SnackbarContext.Provider>
  )
}

export function useSnackbar() {
  const ctx = useContext(SnackbarContext)
  if (!ctx) throw new Error('useSnackbar deve ser usado dentro de SnackbarProvider')
  return ctx
}
