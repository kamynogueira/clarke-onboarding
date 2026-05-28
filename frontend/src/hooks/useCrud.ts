import { useCallback, useState } from 'react'
import { api } from '@/services/api'

interface UseCrudOptions {
  endpoint: string
  onSuccess?: (action: 'create' | 'update' | 'delete') => void
  onError?: (msg: string) => void
}

export function useCrud({ endpoint, onSuccess, onError }: UseCrudOptions) {
  const [saving,   setSaving]   = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  const create = useCallback(async (data: Record<string, any>) => {
    setSaving(true)
    try {
      const res = await api.post(endpoint, data)
      onSuccess?.('create')
      return res.data.data
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'Erro ao criar registro'
      onError?.(msg)
      throw err
    } finally {
      setSaving(false)
    }
  }, [endpoint, onSuccess, onError])

  const update = useCallback(async (id: string, data: Record<string, any>) => {
    setSaving(true)
    try {
      const res = await api.patch(`${endpoint}/${id}`, data)
      onSuccess?.('update')
      return res.data.data
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'Erro ao atualizar registro'
      onError?.(msg)
      throw err
    } finally {
      setSaving(false)
    }
  }, [endpoint, onSuccess, onError])

  const remove = useCallback(async (id: string) => {
    setDeleting(id)
    try {
      await api.delete(`${endpoint}/${id}`)
      onSuccess?.('delete')
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'Erro ao remover registro'
      onError?.(msg)
      throw err
    } finally {
      setDeleting(null)
    }
  }, [endpoint, onSuccess, onError])

  return { create, update, remove, saving, deleting }
}
