import { ReactNode, useEffect } from 'react'
import clsx from 'clsx'
import { X } from 'lucide-react'

interface DrawerProps {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
  width?: string
}

export function Drawer({ open, onClose, title, subtitle, children, footer, width = '480px' }: DrawerProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (open) document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [open, onClose])

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      {/* Overlay */}
      <div
        className={clsx(
          'fixed inset-0 z-[var(--z-overlay)] transition-opacity duration-300',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
        style={{ background: 'var(--color-surface-overlay)' }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        style={{ width, maxWidth: '100vw' }}
        className={clsx(
          'fixed top-0 right-0 h-full z-[var(--z-drawer)]',
          'bg-[var(--color-surface-default)] shadow-[-4px_0_24px_rgba(0,0,0,0.08)]',
          'flex flex-col transition-transform duration-300 ease-in-out',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-[var(--color-border-subtle)] flex-shrink-0">
          <div>
            <h2 className="text-[20px] font-bold text-[var(--color-text-primary)]">{title}</h2>
            {subtitle && (
              <p className="text-[12px] text-[var(--color-text-secondary)] mt-0.5">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar painel"
            className={clsx(
              'w-8 h-8 rounded-full flex items-center justify-center border-none bg-transparent cursor-pointer',
              'text-[var(--color-text-secondary)]',
              'hover:bg-[var(--color-surface-muted)] transition-colors',
              'focus-visible:outline-none focus-visible:shadow-[var(--effect-focus-gray)]',
            )}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex-shrink-0 px-6 py-4 border-t border-[var(--color-border-subtle)] flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </>
  )
}
