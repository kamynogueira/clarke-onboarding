import { InputHTMLAttributes, ReactNode, useId } from 'react'
import clsx from 'clsx'

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  error?: string
  helper?: string
  icon?: ReactNode
  required?: boolean
}

export function TextField({
  label,
  placeholder,
  value,
  onChange,
  error,
  helper,
  icon,
  required,
  disabled,
  className,
  id: externalId,
  ...props
}: TextFieldProps) {
  const generatedId = useId()
  const id = externalId ?? generatedId
  const helperId = `${id}-helper`
  const hasValue = value !== undefined && value !== ''

  return (
    <div className="flex flex-col gap-1 w-full">
      <label
        htmlFor={id}
        className="flex items-center gap-1.5 text-[12px] font-bold text-[var(--color-text-primary)]"
      >
        {label}
        {required && <span className="text-[var(--color-text-danger)]">*</span>}
      </label>

      <div className="relative flex items-center">
        <input
          {...props}
          id={id}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          aria-invalid={!!error}
          aria-describedby={helper || error ? helperId : undefined}
          aria-required={required}
          data-state={hasValue ? 'answered' : 'default'}
          className={clsx(
            'w-full px-[14px] py-[10px] rounded-[var(--radius-pill)]',
            'border-[1.5px] border-transparent',
            'bg-[var(--color-surface-muted)]',
            'font-[var(--font-family-base)] text-[12px] text-[var(--color-text-primary)]',
            'placeholder:text-[var(--color-text-disabled)]',
            'outline-none transition-[border-color,background-color] duration-[150ms] ease-[ease]',
            'focus:bg-[var(--color-surface-default)] focus:border-[var(--color-border-focus)]',
            hasValue && !error && 'bg-[var(--color-surface-default)] border-[var(--color-border-default)]',
            error && 'border-[var(--color-border-error)] bg-[var(--color-surface-default)]',
            disabled && 'bg-[var(--color-gray-200)] text-[var(--color-text-disabled)] cursor-not-allowed',
            icon && 'pr-10',
            className,
          )}
        />
        {icon && (
          <span
            className={clsx(
              'absolute right-[14px] pointer-events-none',
              error ? 'text-[var(--color-border-error)]' : 'text-[var(--color-text-tertiary)]',
            )}
          >
            {icon}
          </span>
        )}
      </div>

      {(helper || error) && (
        <span
          id={helperId}
          className={clsx(
            'text-[10px] pl-1',
            error ? 'text-[var(--color-text-danger)]' : 'text-[var(--color-text-tertiary)]',
          )}
        >
          {error ?? helper}
        </span>
      )}
    </div>
  )
}
