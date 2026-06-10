import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Users, Search, Clock } from 'lucide-react'
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
import { api }               from '@/services/api'
import { UserForm }          from './UserForm'
import { ApproveUserDrawer, ApproveFormData } from './ApproveUserDrawer'

interface User {
  uid: string; name: string; email: string; phone: string
  role: 'admin' | 'collaborator'; position: string
  team: string; startDate: string; twoFactorEnabled: boolean
  status?: 'active' | 'pending' | 'rejected'
}

export function UsersPage() {
  const { show } = useSnackbar()
  const [drawerOpen, setDrawerOpen]     = useState(false)
  const [editingUser, setEditingUser]   = useState<User | null>(null)
  const [deletingUser, setDeletingUser] = useState<User | null>(null)
  const [searchValue, setSearchValue]   = useState('')

  const [pendingUsers, setPendingUsers]   = useState<User[]>([])
  const [pendingLoading, setPendingLoading] = useState(true)
  const [approvingUser, setApprovingUser] = useState<User | null>(null)
  const [approving, setApproving]         = useState(false)
  const [rejectingUid, setRejectingUid]   = useState<string | null>(null)
  const [confirmReject, setConfirmReject] = useState<User | null>(null)

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

  const fetchPending = () => {
    setPendingLoading(true)
    api.get('/users?status=pending&limit=100')
      .then((res) => setPendingUsers(res.data.data ?? []))
      .finally(() => setPendingLoading(false))
  }

  useEffect(() => { fetchPending() }, [])

  const handleApprove = async (data: ApproveFormData) => {
    if (!approvingUser) return
    setApproving(true)
    try {
      await api.patch(`/users/${approvingUser.uid}/approve`, data)
      show({ message: `${approvingUser.name} aprovado com sucesso` })
      setApprovingUser(null)
      fetchPending()
      list.refresh()
    } catch (err: any) {
      show({ message: err?.response?.data?.message ?? 'Erro ao aprovar usuário' })
    } finally {
      setApproving(false)
    }
  }

  const handleReject = async () => {
    if (!confirmReject) return
    setRejectingUid(confirmReject.uid)
    try {
      await api.patch(`/users/${confirmReject.uid}/reject`)
      show({ message: `Cadastro de ${confirmReject.name} rejeitado` })
      setConfirmReject(null)
      setApprovingUser(null)
      fetchPending()
    } catch (err: any) {
      show({ message: err?.response?.data?.message ?? 'Erro ao rejeitar usuário' })
    } finally {
      setRejectingUid(null)
    }
  }

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

      {/* Pending section */}
      {(pendingLoading || pendingUsers.length > 0) && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Clock size={16} className="text-[var(--color-yellow-900)]" />
            <h2 className="text-[15px] font-bold text-[var(--color-text-primary)]">
              Aguardando aprovação
            </h2>
            {pendingUsers.length > 0 && (
              <span className="bg-[var(--color-yellow-100)] text-[var(--color-yellow-900)] text-[11px] font-bold px-2 py-0.5 rounded-full">
                {pendingUsers.length}
              </span>
            )}
          </div>

          {pendingLoading ? (
            <div className="flex justify-center py-6">
              <div className="w-6 h-6 rounded-full border-2 border-[var(--color-green-500)] border-t-transparent animate-spin" />
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {pendingUsers.map((u) => (
                <div key={u.uid}
                  className="bg-[var(--color-surface-default)] border border-[var(--color-border-subtle)] rounded-[var(--radius-md)] px-5 py-4 flex items-center gap-4 shadow-[var(--shadow-elevation)]">
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-bold text-[var(--color-text-primary)]">{u.name}</p>
                    <p className="text-[12px] text-[var(--color-text-secondary)]">{u.email} · {u.phone}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="secondary" size="small"
                      onClick={() => { setConfirmReject(u) }}
                      loading={rejectingUid === u.uid}
                    >
                      Rejeitar
                    </Button>
                    <Button variant="primary" size="small"
                      onClick={() => setApprovingUser(u)}
                    >
                      Aprovar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

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

      <ApproveUserDrawer
        open={!!approvingUser}
        user={approvingUser}
        saving={approving}
        rejecting={rejectingUid === approvingUser?.uid}
        onClose={() => setApprovingUser(null)}
        onApprove={handleApprove}
        onReject={() => { setConfirmReject(approvingUser); setApprovingUser(null) }}
      />

      <ConfirmModal open={!!deletingUser} onClose={() => setDeletingUser(null)}
        onConfirm={async () => { if (deletingUser) await crud.remove(deletingUser.uid) }}
        loading={!!crud.deleting}
        description={`Tem certeza que deseja excluir ${deletingUser?.name}?`} />

      <ConfirmModal open={!!confirmReject} onClose={() => setConfirmReject(null)}
        onConfirm={handleReject}
        loading={!!rejectingUid}
        description={`Tem certeza que deseja rejeitar o cadastro de ${confirmReject?.name}?`} />
    </div>
  )
}
