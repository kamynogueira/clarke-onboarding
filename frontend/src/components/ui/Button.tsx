import { ButtonHTMLAttributes, ReactNode } from 'react'
import clsx from 'clsx'

type Variant = 'primary' | 'secondary' | 'tertiary' | 'danger' | 'blue'
type Size = 'small' | 'medium' | 'big'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: Variant
  size?: Size
  iconLeft?: ReactNode
  iconRight?: ReactNode
  long?: boolean
  loading?: boolean
  children: ReactNode
}

const variantStyles: Record<Variant, string> = {
  primary:   'bg-[var(--color-action-primary)] text-[var(--color-text-on-brand)] hover:bg-[var(--color-action-primary-hover)] focus-visible:shadow-[var(--effect-focus-primary)]',
  secondary: 'bg-[var(--color-action-secondary)] text-[var(--color-text-primary)] hover:bg-[var(--color-action-secondary-hover)] focus-visible:shadow-[var(--effect-focus-gray)]',
  tertiary:  'bg-transparent text-[var(--color-text-primary)] hover:bg-[var(--color-surface-muted)] focus-visible:shadow-[var(--effect-focus-gray)]',
  danger:    'bg-[var(--color-action-danger)] text-[var(--color-text-on-dark)] hover:bg-[var(--color-action-danger-hover)] focus-visible:shadow-[var(--effect-focus-danger)]',
  blue:      'bg-[var(--color-action-blue)] text-[var(--color-text-on-dark)] hover:bg-[var(--color-action-blue-hover)] focus-visible:shadow-[var(--effect-focus-blue)]',
}

const sizeStyles: Record<Size, string> = {
  small:  'px-4 py-2 text-[12px] gap-1',
  medium: 'px-5 py-[10px] text-[14px] gap-2',
  big:    'px-7 py-[14px] text-[16px] gap-2',
}

const iconSizeStyles: Record<Size, string> = {
  small:  'w-[14px] h-[14px]',
  medium: 'w-[16px] h-[16px]',
  big:    'w-[20px] h-[20px]',
}

export function Button({
  variant,
  size = 'medium',
  iconLeft,
  iconRight,
  long = false,
  loading = false,
  disabled,
  children,
  className,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading

  return (
    <button
      {...props}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      className={clsx(
        'inline-flex items-center justify-center rounded-[var(--radius-pill)]',
        'font-bold font-[var(--font-family-base)] whitespace-nowrap',
        'border-none cursor-pointer outline-none',
        'transition-[background-color,box-shadow,opacity] duration-[150ms] ease-[ease]',
        variantStyles[variant],
        sizeStyles[size],
        long && 'w-full',
        isDisabled && 'opacity-40 cursor-not-allowed pointer-events-none',
        'disabled:bg-[var(--color-action-disabled-bg)] disabled:text-[var(--color-action-disabled-text)]',
        className,
      )}
    >
      {loading ? (
        <span className={clsx('animate-spin rounded-full border-2 border-current border-t-transparent', iconSizeStyles[size])} />
      ) : (
        iconLeft && <span className={clsx('flex-shrink-0', iconSizeStyles[size])}>{iconLeft}</span>
      )}
      {children}
      {iconRight && !loading && (
        <span className={clsx('flex-shrink-0', iconSizeStyles[size])}>{iconRight}</span>
      )}
    </button>
  )
}
