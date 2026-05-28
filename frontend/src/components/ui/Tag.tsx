import { ReactNode } from 'react'
import clsx from 'clsx'
import { X } from 'lucide-react'

type Theme = 'gray' | 'green' | 'red' | 'yellow' | 'ghost' | 'super-green' | 'black' | 'blue' | 'pink'
type Size = 'small' | 'medium'

interface TagProps {
  theme: Theme
  size?: Size
  icon?: ReactNode
  onRemove?: () => void
  children: ReactNode
}

const themeStyles: Record<Theme, string> = {
  gray:         'bg-[var(--color-gray-200)] text-[var(--color-gray-700)]',
  green:        'bg-[var(--color-green-100)] text-[var(--color-green-500)]',
  red:          'bg-[var(--color-red-100)] text-[var(--color-red-700)]',
  yellow:       'bg-[var(--color-yellow-100)] text-[var(--color-yellow-900)]',
  ghost:        'bg-transparent border border-[var(--color-border-default)] text-[var(--color-text-tertiary)]',
  'super-green':'bg-[var(--color-green-500)] text-[var(--color-text-on-brand)]',
  black:        'bg-[var(--color-gray-700)] text-[var(--color-text-on-dark)]',
  blue:         'bg-[var(--color-blue-100)] text-[var(--color-blue-700)]',
  pink:         'bg-[var(--color-pink-100)] text-[var(--color-pink-500)]',
}

const sizeStyles: Record<Size, string> = {
  small:  'px-2 py-0.5 text-[10px]',
  medium: 'px-3 py-1 text-[12px]',
}

export function Tag({ theme, size = 'medium', icon, onRemove, children }: TagProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-[var(--radius-pill)] font-[var(--font-family-base)] whitespace-nowrap',
        themeStyles[theme],
        sizeStyles[size],
      )}
    >
      {icon && <span className="flex-shrink-0 w-3 h-3">{icon}</span>}
      {children}
      {onRemove && (
        <button
          onClick={onRemove}
          aria-label={`Remover ${children}`}
          className={clsx(
            'inline-flex items-center justify-center rounded-full border-none cursor-pointer p-0',
            'bg-black/10 hover:bg-black/20 transition-colors',
            size === 'small' ? 'w-3 h-3' : 'w-4 h-4',
            (theme === 'super-green' || theme === 'black') && 'bg-white/20 hover:bg-white/35',
          )}
        >
          <X size={size === 'small' ? 8 : 10} />
        </button>
      )}
    </span>
  )
}
