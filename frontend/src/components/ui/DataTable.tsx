import { ReactNode } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import clsx from 'clsx'
import { Button } from './Button'

export interface Column<T> {
  key: string
  header: string
  width?: string
  render: (row: T) => ReactNode
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  total: number
  page: number
  pageSize: number
  onPageChange: (page: number) => void
  emptyMessage?: string
  emptyIcon?: ReactNode
  rowKey: (row: T) => string
}

function SkeletonRow({ cols }: { cols: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <div className="h-4 bg-[var(--color-surface-muted)] rounded-full animate-pulse w-3/4" />
        </td>
      ))}
    </tr>
  )
}

export function DataTable<T>({
  columns,
  data,
  loading,
  total,
  page,
  pageSize,
  onPageChange,
  emptyMessage = 'Nenhum registro encontrado',
  emptyIcon,
  rowKey,
}: DataTableProps<T>) {
  const totalPages = Math.ceil(total / pageSize)
  const from = total === 0 ? 0 : page * pageSize + 1
  const to   = Math.min((page + 1) * pageSize, total)

  return (
    <div className="bg-[var(--color-surface-default)] rounded-[var(--radius-md)] shadow-[var(--shadow-elevation)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[var(--color-surface-muted)]">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={col.width ? { width: col.width } : undefined}
                  className="px-6 py-3 text-left text-[12px] font-bold text-[var(--color-text-secondary)] whitespace-nowrap"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border-subtle)]">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <SkeletonRow key={i} cols={columns.length} />
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-16 text-center">
                  {emptyIcon && (
                    <div className="flex justify-center mb-3 text-[var(--color-text-tertiary)]">
                      {emptyIcon}
                    </div>
                  )}
                  <p className="text-[14px] text-[var(--color-text-secondary)]">{emptyMessage}</p>
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={rowKey(row)}
                  className="hover:bg-[var(--color-surface-subtle)] transition-colors"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-4">
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      {!loading && total > 0 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-[var(--color-border-subtle)]">
          <p className="text-[12px] text-[var(--color-text-secondary)]">
            {from}–{to} de {total} registros
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page === 0}
              aria-label="Página anterior"
              className={clsx(
                'w-8 h-8 rounded-full flex items-center justify-center border border-[var(--color-border-default)]',
                'text-[var(--color-text-secondary)] transition-colors',
                page === 0
                  ? 'opacity-40 cursor-not-allowed'
                  : 'hover:bg-[var(--color-surface-muted)] cursor-pointer',
              )}
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
              const p = totalPages <= 5 ? i : Math.max(0, Math.min(page - 2, totalPages - 5)) + i
              return (
                <button
                  key={p}
                  onClick={() => onPageChange(p)}
                  className={clsx(
                    'w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold transition-colors',
                    p === page
                      ? 'bg-[var(--color-green-500)] text-[var(--color-text-on-brand)]'
                      : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)] cursor-pointer',
                  )}
                >
                  {p + 1}
                </button>
              )
            })}

            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages - 1}
              aria-label="Próxima página"
              className={clsx(
                'w-8 h-8 rounded-full flex items-center justify-center border border-[var(--color-border-default)]',
                'text-[var(--color-text-secondary)] transition-colors',
                page >= totalPages - 1
                  ? 'opacity-40 cursor-not-allowed'
                  : 'hover:bg-[var(--color-surface-muted)] cursor-pointer',
              )}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
