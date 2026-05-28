import { useState } from 'react'
import { Plus, Pencil, Trash2, BookOpen, Settings } from 'lucide-react'
import { PageHeader }        from '@/components/ui/PageHeader'
import { DataTable, Column } from '@/components/ui/DataTable'
import { Button }            from '@/components/ui/Button'
import { Select }            from '@/components/ui/Select'
import { Tag }               from '@/components/ui/Tag'
import { ConfirmModal }      from '@/components/ui/ConfirmModal'
import { Drawer }            from '@/components/ui/Drawer'
import { useList }           from '@/hooks/useList'
import { useCrud }           from '@/hooks/useCrud'
import { useSnackbar }       from '@/components/ui/Snackbar'
import { TrailForm }         from './TrailForm'
import { TrailItems }        from './TrailItems'

interface Trail {
  id: string; title: string; description: string; status: 'draft' | 'published'
  minScoreToAdvance: number; assignedTo: { teams: string[]; positions: string[] }
  createdAt: string
}

export function TrailsPage() {
  const { show } = useSnackbar()
  const [drawerOpen, setDrawerOpen]     = useState(false)
  const [editingTrail, setEditingTrail] = useState<Trail | null>(null)
  const [deletingTrail, setDeletingTrail] = useState<Trail | null>(null)
  const [itemsTrailId, setItemsTrailId] = useState<string | null>(null)

  const list = useList<Trail>({ endpoint: '/trails' })

  const crud = useCrud({
    endpoint: '/trails',
    onSuccess: (action) => {
      const msgs = { create: 'Trilha criada', update: 'Trilha atualizada', delete: 'Trilha removida' }
      show({ message: msgs[action] })
      list.refresh()
      setDrawerOpen(false); setEditingTrail(null); setDeletingTrail(null)
    },
    onError: (msg) => show({ message: msg }),
  })

  const columns: Column<Trail>[] = [
    {
      key: 'title', header: 'Trilha',
      render: (t) => (
        <div>
          <p className="text-[14px] font-bold text-[var(--color-text-primary)]">{t.title}</p>
          <p className="text-[12px] text-[var(--color-text-secondary)] truncate max-w-[280px]">{t.description}</p>
        </div>
      ),
    },
    {
      key: 'status', header: 'Status', width: '110px',
      render: (t) => <Tag theme={t.status === 'published' ? 'super-green' : 'gray'} size="small">{t.status === 'published' ? 'Publicado' : 'Rascunho'}</Tag>,
    },
    {
      key: 'score', header: 'Nota mínima', width: '110px',
      render: (t) => <span className="text-[14px] text-[var(--color-text-secondary)]">{t.minScoreToAdvance}%</span>,
    },
    {
      key: 'assigned', header: 'Atribuído a', width: '200px',
      render: (t) => (
        <div className="flex flex-wrap gap-1">
          {t.assignedTo?.teams?.map((team) => <Tag key={team} theme="blue" size="small">{team}</Tag>)}
          {t.assignedTo?.positions?.map((pos) => <Tag key={pos} theme="green" size="small">{pos}</Tag>)}
          {!t.assignedTo?.teams?.length && !t.assignedTo?.positions?.length && (
            <span className="text-[12px] text-[var(--color-text-tertiary)]">Nenhuma atribuição</span>
          )}
        </div>
      ),
    },
    {
      key: 'actions', header: '', width: '110px',
      render: (t) => (
        <div className="flex items-center gap-1">
          <button onClick={() => setItemsTrailId(t.id)} aria-label={`Gerenciar itens de ${t.title}`}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--color-text-tertiary)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-action-blue)] transition-colors">
            <Settings size={15} />
          </button>
          <button onClick={() => { setEditingTrail(t); setDrawerOpen(true) }} aria-label={`Editar ${t.title}`}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--color-text-tertiary)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text-primary)] transition-colors">
            <Pencil size={15} />
          </button>
          <button onClick={() => setDeletingTrail(t)} aria-label={`Excluir ${t.title}`}
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
        title="Trilhas"
        subtitle={`${list.total} trilha${list.total !== 1 ? 's' : ''} cadastrada${list.total !== 1 ? 's' : ''}`}
        action={
          <Button variant="primary" size="medium" iconLeft={<Plus size={16} />}
            onClick={() => { setEditingTrail(null); setDrawerOpen(true) }}>
            Nova trilha
          </Button>
        }
      />

      <div className="flex gap-3 mb-6">
        <div className="w-[180px]">
          <Select placeholder="Todos os status" value={list.filters.status ?? ''}
            onChange={(v) => list.setFilter('status', v || undefined)}
            options={[{ value: '', label: 'Todos os status' }, { value: 'published', label: 'Publicados' }, { value: 'draft', label: 'Rascunhos' }]} />
        </div>
      </div>

      <DataTable columns={columns} data={list.data} loading={list.loading}
        total={list.total} page={list.page} pageSize={list.pageSize}
        onPageChange={list.setPage} rowKey={(t) => t.id}
        emptyMessage="Nenhuma trilha encontrada" emptyIcon={<BookOpen size={36} />} />

      <TrailForm open={drawerOpen} onClose={() => { setDrawerOpen(false); setEditingTrail(null) }}
        onSubmit={async (data) => { if (editingTrail) await crud.update(editingTrail.id, data); else await crud.create(data) }}
        saving={crud.saving} trail={editingTrail} />

      <Drawer open={!!itemsTrailId} onClose={() => setItemsTrailId(null)}
        title="Conteúdos da trilha" subtitle="Arraste para reordenar" width="520px">
        {itemsTrailId && <TrailItems trailId={itemsTrailId} />}
      </Drawer>

      <ConfirmModal open={!!deletingTrail} onClose={() => setDeletingTrail(null)}
        onConfirm={async () => { if (deletingTrail) await crud.remove(deletingTrail.id) }}
        loading={!!crud.deleting}
        description={`Tem certeza que deseja excluir "${deletingTrail?.title}"?`} />
    </div>
  )
}
