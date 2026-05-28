import { useEffect, useState } from 'react'
import { GripVertical, Trash2, Plus, FileText, Video, HelpCircle, FileIcon } from 'lucide-react'
import { Button }   from '@/components/ui/Button'
import { Select }   from '@/components/ui/Select'
import { Tag }      from '@/components/ui/Tag'
import { api }      from '@/services/api'
import { useSnackbar } from '@/components/ui/Snackbar'

const TYPE_ICON: Record<string, any> = {
  pdf: FileText, video: Video, quiz: HelpCircle, gdoc: FileIcon,
}
const TYPE_LABEL: Record<string, string> = {
  pdf: 'PDF', video: 'Vídeo', quiz: 'Prova', gdoc: 'Google Doc',
}
const TYPE_THEME: Record<string, any> = {
  pdf: 'red', video: 'blue', quiz: 'yellow', gdoc: 'green',
}

interface TrailItem { id: string; order: number; contentId: string; type: string; contentTitle?: string }
interface Content   { id: string; title: string; type: string }

export function TrailItems({ trailId }: { trailId: string }) {
  const { show } = useSnackbar()
  const [items,    setItems]    = useState<TrailItem[]>([])
  const [contents, setContents] = useState<Content[]>([])
  const [selContent, setSelContent] = useState('')
  const [loading,  setLoading]  = useState(true)
  const [saving,   setSaving]   = useState(false)
  const [dragging, setDragging] = useState<number | null>(null)

  const load = async () => {
    setLoading(true)
    try {
      const [itemsRes, contentsRes] = await Promise.all([
        api.get(`/trails/${trailId}/items`),
        api.get('/contents?limit=100'),
      ])
      const rawItems: TrailItem[] = itemsRes.data.data ?? []
      const rawContents: Content[] = contentsRes.data.data ?? []
      setContents(rawContents)
      setItems(rawItems.map((item) => ({
        ...item,
        contentTitle: rawContents.find((c) => c.id === item.contentId)?.title ?? item.contentId,
      })))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [trailId])

  const addItem = async () => {
    if (!selContent) return
    const content = contents.find((c) => c.id === selContent)
    if (!content) return
    setSaving(true)
    try {
      await api.post(`/trails/${trailId}/items`, {
        contentId: selContent, type: content.type, order: items.length,
      })
      setSelContent('')
      show({ message: 'Conteúdo adicionado à trilha' })
      load()
    } catch {
      show({ message: 'Erro ao adicionar conteúdo' })
    } finally {
      setSaving(false)
    }
  }

  const removeItem = async (itemId: string) => {
    try {
      await api.delete(`/trails/${trailId}/items/${itemId}`)
      show({ message: 'Item removido da trilha' })
      load()
    } catch {
      show({ message: 'Erro ao remover item' })
    }
  }

  const moveItem = (from: number, to: number) => {
    const next = [...items]
    const [moved] = next.splice(from, 1)
    next.splice(to, 0, moved)
    setItems(next.map((item, i) => ({ ...item, order: i })))
  }

  const saveOrder = async () => {
    setSaving(true)
    try {
      await api.put(`/trails/${trailId}/items/reorder`, {
        items: items.map(({ id, order }) => ({ itemId: id, order })),
      })
      show({ message: 'Ordem salva com sucesso' })
    } catch {
      show({ message: 'Erro ao salvar ordem' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-6 h-6 rounded-full border-2 border-[var(--color-green-500)] border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Adicionar conteúdo */}
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <Select
            label="Adicionar conteúdo"
            placeholder="Selecionar conteúdo…"
            value={selContent}
            onChange={setSelContent}
            options={contents
              .filter((c) => !items.find((i) => i.contentId === c.id))
              .map((c) => ({ value: c.id, label: `${c.title} (${TYPE_LABEL[c.type] ?? c.type})` }))}
          />
        </div>
        <Button variant="primary" size="medium" iconLeft={<Plus size={16} />}
          onClick={addItem} loading={saving} disabled={!selContent}>
          Adicionar
        </Button>
      </div>

      {/* Lista de itens */}
      {items.length === 0 ? (
        <div className="text-center py-8 text-[14px] text-[var(--color-text-secondary)]">
          Nenhum conteúdo na trilha ainda
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-2">
            {items.map((item, index) => {
              const Icon = TYPE_ICON[item.type] ?? FileIcon
              return (
                <div
                  key={item.id}
                  draggable
                  onDragStart={() => setDragging(index)}
                  onDragOver={(e) => { e.preventDefault() }}
                  onDrop={() => { if (dragging !== null && dragging !== index) { moveItem(dragging, index); setDragging(null) } }}
                  onDragEnd={() => setDragging(null)}
                  className={[
                    'flex items-center gap-3 p-3 rounded-[var(--radius-sm)]',
                    'bg-[var(--color-surface-default)] border border-[var(--color-border-subtle)]',
                    'transition-opacity',
                    dragging === index ? 'opacity-50' : 'opacity-100',
                  ].join(' ')}
                >
                  <GripVertical size={18} className="text-[var(--color-text-tertiary)] cursor-grab flex-shrink-0" />
                  <div className={[
                    'w-8 h-8 rounded-[var(--radius-sm)] flex items-center justify-center flex-shrink-0',
                    item.type === 'pdf' ? 'bg-[var(--color-red-100)] text-[var(--color-red-700)]'
                    : item.type === 'video' ? 'bg-[var(--color-blue-100)] text-[var(--color-blue-700)]'
                    : item.type === 'quiz' ? 'bg-[var(--color-yellow-100)] text-[var(--color-yellow-900)]'
                    : 'bg-[var(--color-green-100)] text-[var(--color-green-500)]',
                  ].join(' ')}>
                    <Icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-bold text-[var(--color-text-primary)] truncate">{item.contentTitle}</p>
                  </div>
                  <Tag theme={TYPE_THEME[item.type] ?? 'gray'} size="small">{TYPE_LABEL[item.type] ?? item.type}</Tag>
                  <span className="text-[12px] text-[var(--color-text-tertiary)] w-6 text-center">{index + 1}</span>
                  <button onClick={() => removeItem(item.id)} aria-label="Remover item"
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[var(--color-text-tertiary)] hover:bg-[var(--color-feedback-error-bg)] hover:text-[var(--color-text-danger)] transition-colors flex-shrink-0">
                    <Trash2 size={14} />
                  </button>
                </div>
              )
            })}
          </div>
          <Button variant="secondary" size="small" onClick={saveOrder} loading={saving}>
            Salvar ordem
          </Button>
        </>
      )}
    </div>
  )
}
