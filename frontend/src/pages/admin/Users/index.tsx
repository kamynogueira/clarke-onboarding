import { useState } from 'react'
import { Plus, Pencil, Trash2, Users, Search } from 'lucide-react'
import { PageHeader }        from '@/components/ui/PageHeader'
import { DataTable, Column } from '@/components/ui/DataTable'
import { Button }            from '@/components/ui/Button'
import { TextField }         from '@/components/ui/TextField'
import { Select }            from '@/components/ui/Select'
import { Tag }               from '@/components/ui/Tag'
import { ConfirmModal }      from '@/components/ui/ConfirmModal'
import { useList }           from '@/hooks/useList'
import { useCrud }           from '@/hooks/useCrud'
import { useSnackbar }       from '@/components/ui/Snackbar'
import { UserForm }          from './UserForm'

interface User {
  uid: string; name: string; email: string; phone: string
  role: 'admin' | 'collaborator'; position: string
  team: string; startDate: string; twoFactorEnabled: boolean
}

export function UsersPage() {
  const { show } = useSnackbar()
  const [drawerOpen, setDrawerOpen]     = useState(false)
  const [editingUser, setEditingUser]   = useState<User | null>(null)
  const [deletingUser, setDeletingUser] = useState<User | null>(null)
  const [searchValue, setSearchValue]   = useState('')

  const list = useList<User>({ endpoint: '/users' })

  const crud = useCrud({
    endpoint: '/users',
    onSuccess: (action) => {
      const msgs = { create: 'Usuário criado com sucesso', update: 'Usuário atualizado', delete: 'Usuário removido' }
      show({ message: msgs[action] })
      list.refresh()
      setDrawerOpen(false); setEditingUser(null); setDeletingUser(null)
    },
    onError: (msg) => show({ message: msg }),
  })

  const columns: Column<User>[] = [
    {
      key: 'user', header: 'Usuário',
      render: (u) => (
        <div>
          <p className="text-[14px] font-bold text-[var(--color-text-primary)]">{u.name}</p>
          <p className="text-[12px] text-[var(--color-text-secondary)]">{u.email}</p>
        </div>
      ),
    },
    {
      key: 'role', header: 'Perfil', width: '120px',
      render: (u) => <Tag theme={u.role === 'admin' ? 'blue' : 'green'} size="small">{u.role === 'admin' ? 'Admin' : 'Colaborador'}</Tag>,
    },
    {
      key: 'team', header: 'Time', width: '140px',
      render: (u) => <span className="text-[14px] text-[var(--color-text-secondary)]">{u.team || '—'}</span>,
    },
    {
      key: 'position', header: 'Cargo', width: '140px',
      render: (u) => <span className="text-[14px] text-[var(--color-text-secondary)]">{u.position || '—'}</span>,
    },
    {
      key: 'startDate', header: 'Entrada', width: '110px',
      render: (u) => <span className="text-[12px] text-[var(--color-text-secondary)]">{u.startDate ? new Date(u.startDate).toLocaleDateString('pt-BR') : '—'}</span>,
    },
    {
      key: '2fa', header: '2FA', width: '60px',
      render: (u) => <Tag theme={u.twoFactorEnabled ? 'super-green' : 'ghost'} size="small">{u.twoFactorEnabled ? 'On' : 'Off'}</Tag>,
    },
    {
      key: 'actions', header: '', width: '80px',
      render: (u) => (
        <div className="flex items-center gap-1">
          <button onClick={() => { setEditingUser(u); setDrawerOpen(true) }} aria-label={`Editar ${u.name}`}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--color-text-tertiary)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text-primary)] transition-colors">
            <Pencil size={15} />
          </button>
          <button onClick={() => setDeletingUser(u)} aria-label={`Excluir ${u.name}`}
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
        title="Usuários"
        subtitle={`${list.total} usuário${list.total !== 1 ? 's' : ''} cadastrado${list.total !== 1 ? 's' : ''}`}
        action={
          <Button variant="primary" size="medium" iconLeft={<Plus size={16} />}
            onClick={() => { setEditingUser(null); setDrawerOpen(true) }}>
            Novo usuário
          </Button>
        }
      />

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex-1 min-w-[200px] max-w-[320px]">
          <TextField label="" placeholder="Buscar por nome…" value={searchValue}
            onChange={(v) => { setSearchValue(v); list.setFilter('search', v) }}
            icon={<Search size={14} />} />
        </div>
        <div className="w-[160px]">
          <Select placeholder="Todos os perfis" value={list.filters.role ?? ''}
            onChange={(v) => list.setFilter('role', v || undefined)}
            options={[{ value: '', label: 'Todos os perfis' }, { value: 'collaborator', label: 'Colaboradores' }, { value: 'admin', label: 'Admins' }]} />
        </div>
        <div className="w-[160px]">
          <Select placeholder="Todos os times" value={list.filters.team ?? ''}
            onChange={(v) => list.setFilter('team', v || undefined)}
            options={[{ value: '', label: 'Todos os times' }]} />
        </div>
      </div>

      <DataTable columns={columns} data={list.data} loading={list.loading}
        total={list.total} page={list.page} pageSize={list.pageSize}
        onPageChange={list.setPage} rowKey={(u) => u.uid}
        emptyMessage="Nenhum usuário encontrado" emptyIcon={<Users size={36} />} />

      <UserForm open={drawerOpen} onClose={() => { setDrawerOpen(false); setEditingUser(null) }}
        onSubmit={async (data) => { if (editingUser) await crud.update(editingUser.uid, data); else await crud.create(data) }}
        saving={crud.saving} user={editingUser} />

      <ConfirmModal open={!!deletingUser} onClose={() => setDeletingUser(null)}
        onConfirm={async () => { if (deletingUser) await crud.remove(deletingUser.uid) }}
        loading={!!crud.deleting}
        description={`Tem certeza que deseja excluir ${deletingUser?.name}?`} />
    </div>
  )
}
