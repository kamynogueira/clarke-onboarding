import { SelectHTMLAttributes } from 'react'
import clsx from 'clsx'
import { ChevronDown } from 'lucide-react'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string
  options: SelectOption[]
  value?: string
  onChange?: (value: string) => void
  error?: string
  placeholder?: string
}

export function Select({
  label,
  options,
  value,
  onChange,
  error,
  placeholder,
  disabled,
  className,
  ...props
}: SelectProps) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label className="text-[12px] font-bold text-[var(--color-text-primary)]">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <select
          {...props}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.value)}
          className={clsx(
            'w-full appearance-none px-[14px] py-[10px] pr-9 rounded-[var(--radius-pill)]',
            'border-[1.5px] outline-none',
            'font-[var(--font-family-base)] text-[12px]',
            'transition-[border-color,background-color] duration-[150ms]',
            value
              ? 'bg-[var(--color-surface-default)] border-[var(--color-border-default)] text-[var(--color-text-primary)]'
              : 'bg-[var(--color-surface-muted)] border-transparent text-[var(--color-text-disabled)]',
            error && 'border-[var(--color-border-error)] bg-[var(--color-surface-default)]',
            disabled && 'opacity-50 cursor-not-allowed bg-[var(--color-gray-200)]',
            'focus:bg-[var(--color-surface-default)] focus:border-[var(--color-border-focus)]',
            'cursor-pointer',
            className,
          )}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          className="absolute right-[14px] pointer-events-none text-[var(--color-text-tertiary)]"
        />
      </div>
      {error && (
        <span className="text-[10px] text-[var(--color-text-danger)] pl-1">{error}</span>
      )}
    </div>
  )
}
