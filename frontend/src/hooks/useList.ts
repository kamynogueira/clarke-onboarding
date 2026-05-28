import { useCallback, useEffect, useState } from 'react'
import { api } from '@/services/api'

interface UseListOptions<F> {
  endpoint: string
  defaultFilters?: F
}

interface ListResult<T> {
  data: T[]
  total: number
  loading: boolean
  filters: Record<string, any>
  page: number
  pageSize: number
  setFilter: (key: string, value: any) => void
  setPage: (page: number) => void
  refresh: () => void
}

export function useList<T, F extends Record<string, any> = Record<string, any>>(
  { endpoint, defaultFilters = {} as F }: UseListOptions<F>,
): ListResult<T> {
  const [data, setData]       = useState<T[]>([])
  const [total, setTotal]     = useState(0)
  const [loading, setLoading] = useState(true)
  const [page, setPage]       = useState(0)
  const pageSize              = 20
  const [filters, setFilters] = useState<Record<string, any>>(defaultFilters)
  const [tick, setTick]       = useState(0)

  const refresh = useCallback(() => setTick((t) => t + 1), [])

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    const params = new URLSearchParams({
      ...Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== undefined && v !== ''),
      ),
      limit:  String(pageSize),
      offset: String(page * pageSize),
    })

    api
      .get(`${endpoint}?${params}`)
      .then((res) => {
        if (cancelled) return
        setData(res.data.data ?? [])
        setTotal(res.data.total ?? 0)
      })
      .catch(() => {
        if (!cancelled) setData([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [endpoint, page, filters, tick])

  const setFilter = useCallback((key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPage(0)
  }, [])

  return { data, total, loading, filters, page, pageSize, setFilter, setPage, refresh }
}
