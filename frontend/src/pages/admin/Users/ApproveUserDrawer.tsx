import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { TextField } from '@/components/ui/TextField'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { Drawer } from '@/components/ui/Drawer'

const schema = z.object({
  role:      z.enum(['admin', 'collaborator']),
  position:  z.string().min(1, 'Cargo obrigatório'),
  team:      z.string().min(1, 'Time obrigatório'),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida'),
})

export type ApproveFormData = z.infer<typeof schema>

interface PendingUser {
  uid: string
  name: string
  email: string
  phone: string
}

interface ApproveUserDrawerProps {
  open:     boolean
  user:     PendingUser | null
  saving:   boolean
  onClose:  () => void
  onApprove: (data: ApproveFormData) => Promise<void>
  onReject:  () => void
  rejecting: boolean
}

export function ApproveUserDrawer({
  open, user, saving, onClose, onApprove, onReject, rejecting,
}: ApproveUserDrawerProps) {
  const { handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<ApproveFormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'collaborator', position: '', team: '', startDate: '' },
  })

  const values = watch()

  useEffect(() => {
    if (open) reset({ role: 'collaborator', position: '', team: '', startDate: '' })
  }, [open, reset])

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Aprovar cadastro"
      subtitle={user ? `Completar dados de ${user.name}` : ''}
      footer={
        <>
          <Button variant="tertiary" size="medium" onClick={onReject} loading={rejecting} disabled={saving}>
            Rejeitar
          </Button>
          <Button variant="primary" size="medium" loading={saving} disabled={rejecting} onClick={handleSubmit(onApprove)}>
            Aprovar
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        {/* Read-only user info */}
        <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-sm)] p-4 flex flex-col gap-1">
          <p className="text-[14px] font-bold text-[var(--color-text-primary)]">{user?.name}</p>
          <p className="text-[12px] text-[var(--color-text-secondary)]">{user?.email}</p>
          <p className="text-[12px] text-[var(--color-text-secondary)]">{user?.phone}</p>
        </div>

        <Select
          label="Perfil de acesso"
          value={values.role}
          onChange={(v) => setValue('role', v as 'admin' | 'collaborator')}
          options={[
            { value: 'collaborator', label: 'Colaborador' },
            { value: 'admin',        label: 'Admin' },
          ]}
          error={errors.role?.message as string}
        />

        <TextField
          label="Cargo"
          placeholder="Analista"
          value={values.position}
          onChange={(v) => setValue('position', v)}
          error={errors.position?.message}
          required
        />

        <TextField
          label="Time"
          placeholder="Engineering"
          value={values.team}
          onChange={(v) => setValue('team', v)}
          error={errors.team?.message}
          required
        />

        <TextField
          label="Data de entrada"
          type="date"
          value={values.startDate}
          onChange={(v) => setValue('startDate', v)}
          error={errors.startDate?.message}
          required
        />
      </div>
    </Drawer>
  )
}
