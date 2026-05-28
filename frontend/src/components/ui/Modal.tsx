import { ReactNode, useEffect, useRef } from 'react'
import clsx from 'clsx'
import { X } from 'lucide-react'
import { Button } from './Button'

type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger' | 'blue'

interface ModalProps {
  open: boolean
  onClose: () => void
  size?: 'small' | 'medium'
  icon?: ReactNode
  title: string
  children: ReactNode
  scrollable?: boolean
  primaryAction: { label: string; onClick: () => void; variant?: ButtonVariant; loading?: boolean }
  secondaryAction?: { label: string; onClick: () => void }
}

export function Modal({
  open,
  onClose,
  size = 'small',
  icon,
  title,
  children,
  scrollable = false,
  primaryAction,
  secondaryAction,
}: ModalProps) {
  const titleId = `modal-title-${Math.random().toString(36).slice(2)}`
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (open) closeRef.current?.focus()
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[var(--z-overlay)] flex items-center justify-center p-4"
      style={{ background: 'var(--color-surface-overlay)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={clsx(
          'relative flex w-full flex-col items-center gap-8 rounded-[var(--radius-md)]',
          'bg-[var(--color-surface-subtle)] p-6',
          size === 'small' ? 'max-w-[320px]' : 'max-w-[520px]',
          'shadow-elevation',
        )}
      >
        <button
          ref={closeRef}
          onClick={onClose}
          aria-label="Fechar modal"
          className={clsx(
            'absolute top-4 right-4 w-7 h-7 rounded-full border-none bg-transparent',
            'flex items-center justify-center cursor-pointer',
            'text-[var(--color-text-secondary)]',
            'hover:bg-[var(--color-surface-muted)]',
            'focus-visible:outline-none focus-visible:shadow-[var(--effect-focus-gray)]',
            'transition-colors duration-[150ms]',
          )}
        >
          <X size={16} />
        </button>

        <div className={clsx('flex flex-col gap-3 w-full', icon && 'items-center text-center')}>
          {icon && (
            <div className="w-14 h-14 rounded-full border-2 border-[var(--color-green-500)] flex items-center justify-center text-[var(--color-green-500)] flex-shrink-0">
              {icon}
            </div>
          )}

          <h2
            id={titleId}
            className="text-[20px] font-bold text-[var(--color-text-primary)] font-[var(--font-family-base)]"
          >
            {title}
          </h2>

          <div
            className={clsx(
              'text-[12px] text-[var(--color-text-secondary)] leading-[1.5] font-[var(--font-family-base)]',
              scrollable && 'max-h-[200px] overflow-y-auto pr-2',
            )}
          >
            {children}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 w-full flex-wrap sm:flex-nowrap">
          {secondaryAction && (
            <Button
              variant="secondary"
              size="medium"
              onClick={secondaryAction.onClick}
              className="w-full sm:w-auto"
            >
              {secondaryAction.label}
            </Button>
          )}
          <Button
            variant={primaryAction.variant ?? 'primary'}
            size="medium"
            onClick={primaryAction.onClick}
            loading={primaryAction.loading}
            className="w-full sm:w-auto"
          >
            {primaryAction.label}
          </Button>
        </div>
      </div>
    </div>
  )
}
