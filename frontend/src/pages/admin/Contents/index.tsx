import { useState } from 'react'
import { Plus, Pencil, Trash2, FileText, Video, HelpCircle, FileIcon, Globe } from 'lucide-react'
import { PageHeader }        from '@/components/ui/PageHeader'
import { DataTable, Column } from '@/components/ui/DataTable'
import { Button }            from '@/components/ui/Button'
import { Select }            from '@/components/ui/Select'
import { Tag }               from '@/components/ui/Tag'
import { ConfirmModal }      from '@/components/ui/ConfirmModal'
import { useList }           from '@/hooks/useList'
import { useCrud }           from '@/hooks/useCrud'
import { useSnackbar }       from '@/components/ui/Snackbar'
import { ContentForm }       from './ContentForm'

interface Content {
  id: string; title: string; description: string
  type: 'pdf' | 'video' | 'gdoc' | 'quiz' | 'link'
  url?: string; youtubeId?: string; quizId?: string; createdAt: string
}

const TYPE_LABEL: Record<string, string> = { pdf: 'PDF', video: 'Vídeo', gdoc: 'Google Doc', quiz: 'Prova', link: 'Link Externo' }
const TYPE_THEME: Record<string, any>  = { pdf: 'red', video: 'blue', gdoc: 'green', quiz: 'yellow', link: 'pink' }
const TYPE_ICON: Record<string, any>   = { pdf: FileText, video: Video, gdoc: FileIcon, quiz: HelpCircle, link: Globe }

export function ContentsPage() {
  const { show } = useSnackbar()
  const [drawerOpen, setDrawerOpen]         = useState(false)
  const [editingContent, setEditingContent] = useState<Content | null>(null)
  const [deletingContent, setDeletingContent] = useState<Content | null>(null)

  const list = useList<Content>({ endpoint: '/contents' })
  if (list.error) console.error('[Contents] list error:', list.error)

  const crud = useCrud({
    endpoint: '/contents',
    onSuccess: (action) => {
      const msgs = { create: 'Conteúdo criado', update: 'Conteúdo atualizado', delete: 'Conteúdo removido' }
      show({ message: msgs[action] })
      list.refresh(); setDrawerOpen(false); setEditingContent(null); setDeletingContent(null)
    },
    onError: (msg) => show({ message: msg }),
  })

  const columns: Column<Content>[] = [
    {
      key: 'content', header: 'Conteúdo',
      render: (c) => {
        const Icon = TYPE_ICON[c.type] ?? FileIcon
        return (
          <div className="flex items-center gap-3">
            <div className={[
              'w-9 h-9 rounded-[var(--radius-sm)] flex items-center justify-center flex-shrink-0',
              c.type === 'pdf'   ? 'bg-[var(--color-red-100)] text-[var(--color-red-700)]'
              : c.type === 'video' ? 'bg-[var(--color-blue-100)] text-[var(--color-blue-700)]'
              : c.type === 'quiz'  ? 'bg-[var(--color-yellow-100)] text-[var(--color-yellow-900)]'
              : c.type === 'link'  ? 'bg-[var(--color-pink-100)] text-[var(--color-pink-500)]'
              : 'bg-[var(--color-green-100)] text-[var(--color-green-500)]',
            ].join(' ')}>
              <Icon size={16} />
            </div>
            <div>
              <p className="text-[14px] font-bold text-[var(--color-text-primary)]">{c.title}</p>
              <p className="text-[12px] text-[var(--color-text-secondary)] truncate max-w-[260px]">{c.description}</p>
            </div>
          </div>
        )
      },
    },
    {
      key: 'type', header: 'Tipo', width: '110px',
      render: (c) => <Tag theme={TYPE_THEME[c.type] ?? 'gray'} size="small">{TYPE_LABEL[c.type] ?? c.type}</Tag>,
    },
    {
      key: 'ref', header: 'Referência', width: '220px',
      render: (c) => (
        <span className="text-[12px] text-[var(--color-text-secondary)] truncate block max-w-[200px]">
          {c.url ?? c.youtubeId ?? c.quizId ?? '—'}
        </span>
      ),
    },
    {
      key: 'createdAt', header: 'Criado em', width: '110px',
      render: (c) => <span className="text-[12px] text-[var(--color-text-secondary)]">{new Date(c.createdAt).toLocaleDateString('pt-BR')}</span>,
    },
    {
      key: 'actions', header: '', width: '80px',
      render: (c) => (
        <div className="flex items-center gap-1">
          <button onClick={() => { setEditingContent(c); setDrawerOpen(true) }} aria-label={`Editar ${c.title}`}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--color-text-tertiary)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text-primary)] transition-colors">
            <Pencil size={15} />
          </button>
          <button onClick={() => setDeletingContent(c)} aria-label={`Excluir ${c.title}`}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--color-text-tertiary)] hover:bg-[var(--color-feedback-error-bg)] hover:text-[var(--color-text-danger)] transition-colors">
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="p-8">
      <PageHeader
        title="Conteúdos"
        subtitle={`${list.total} conteúdo${list.total !== 1 ? 's' : ''} cadastrado${list.total !== 1 ? 's' : ''}`}
        action={
          <Button variant="primary" size="medium" iconLeft={<Plus size={16} />}
            onClick={() => { setEditingContent(null); setDrawerOpen(true) }}>
            Novo conteúdo
          </Button>
        }
      />

      <div className="flex gap-3 mb-6">
        <div className="w-[180px]">
          <Select placeholder="Todos os tipos" value={list.filters.type ?? ''}
            onChange={(v) => list.setFilter('type', v || undefined)}
            options={[
              { value: '', label: 'Todos os tipos' },
              { value: 'pdf',   label: 'PDF' },
              { value: 'video', label: 'Vídeo' },
              { value: 'gdoc',  label: 'Google Doc' },
              { value: 'quiz',  label: 'Prova' },
              { value: 'link',  label: 'Link Externo' },
            ]} />
        </div>
      </div>

      <DataTable columns={columns} data={list.data} loading={list.loading}
        total={list.total} page={list.page} pageSize={list.pageSize}
        onPageChange={list.setPage} rowKey={(c) => c.id}
        emptyMessage="Nenhum conteúdo encontrado" emptyIcon={<FileText size={36} />} />

      <ContentForm open={drawerOpen} onClose={() => { setDrawerOpen(false); setEditingContent(null) }}
        onSubmit={async (data) => { if (editingContent) await crud.update(editingContent.id, data); else await crud.create(data) }}
        saving={crud.saving} content={editingContent} />

      <ConfirmModal open={!!deletingContent} onClose={() => setDeletingContent(null)}
        onConfirm={async () => { if (deletingContent) await crud.remove(deletingContent.id) }}
        loading={!!crud.deleting}
        description={`Tem certeza que deseja excluir "${deletingContent?.title}"?`} />
    </div>
  )
}
