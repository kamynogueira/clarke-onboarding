import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { TextField } from '@/components/ui/TextField'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { Drawer } from '@/components/ui/Drawer'

const createSchema = z.object({
  name:               z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
  email:              z.string().email('E-mail inválido'),
  password:           z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
  phone:              z.string().min(10, 'Telefone inválido'),
  role:               z.enum(['admin', 'collaborator']),
  position:           z.string().min(1, 'Cargo obrigatório'),
  team:               z.string().min(1, 'Time obrigatório'),
  startDate:          z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida'),
  twoFactorEnabled:   z.boolean().default(true),
})

const editSchema = createSchema.omit({ password: true, email: true })

export type CreateUserFormData = z.infer<typeof createSchema>
export type EditUserFormData   = z.infer<typeof editSchema>

interface UserFormProps {
  open:     boolean
  onClose:  () => void
  onSubmit: (data: CreateUserFormData | EditUserFormData) => Promise<void>
  saving:   boolean
  user?:    any
}

export function UserForm({ open, onClose, onSubmit, saving, user }: UserFormProps) {
  const isEdit = !!user
  const schema = isEdit ? editSchema : createSchema

  const { handleSubmit, register, setValue, watch, reset, formState: { errors } } = useForm<any>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '', email: '', password: '', phone: '',
      role: 'collaborator', position: '', team: '',
      startDate: '', twoFactorEnabled: true,
    },
  })

  useEffect(() => {
    if (user) {
      reset({
        name: user.name, phone: user.phone,
        role: user.role, position: user.position,
        team: user.team, startDate: user.startDate,
        twoFactorEnabled: user.twoFactorEnabled,
      })
    } else {
      reset({ name: '', email: '', password: '', phone: '', role: 'collaborator', position: '', team: '', startDate: '', twoFactorEnabled: true })
    }
  }, [user, reset])

  const watchedValues = watch()

  const fields: { name: string; label: string; type?: string; placeholder?: string }[] = isEdit
    ? [
        { name: 'name',      label: 'Nome completo',  placeholder: 'João Silva' },
        { name: 'phone',     label: 'Telefone',       placeholder: '(11) 98888-7777' },
        { name: 'position',  label: 'Cargo',          placeholder: 'Analista' },
        { name: 'team',      label: 'Time',           placeholder: 'Engineering' },
        { name: 'startDate', label: 'Data de entrada', type: 'date' },
      ]
    : [
        { name: 'name',      label: 'Nome completo',   placeholder: 'João Silva' },
        { name: 'email',     label: 'E-mail',          placeholder: 'joao@clarke.com.br', type: 'email' },
        { name: 'password',  label: 'Senha temporária', placeholder: 'Mínimo 6 caracteres',  type: 'password' },
        { name: 'phone',     label: 'Telefone',        placeholder: '(11) 98888-7777' },
        { name: 'position',  label: 'Cargo',           placeholder: 'Analista' },
        { name: 'team',      label: 'Time',            placeholder: 'Engineering' },
        { name: 'startDate', label: 'Data de entrada', type: 'date' },
      ]

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={isEdit ? 'Editar usuário' : 'Novo usuário'}
      subtitle={isEdit ? `Editando: ${user?.name}` : 'Preencha os dados do novo colaborador'}
      footer={
        <>
          <Button variant="secondary" size="medium" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button variant="primary" size="medium" loading={saving} onClick={handleSubmit(onSubmit)}>
            {isEdit ? 'Salvar alterações' : 'Criar usuário'}
          </Button>
        </>
      }
    >
      <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)} noValidate>
        {fields.map(({ name, label, type, placeholder }) => (
          <TextField
            key={name}
            label={label}
            type={type ?? 'text'}
            placeholder={placeholder}
            value={watchedValues[name] ?? ''}
            onChange={(v) => setValue(name as any, v)}
            error={(errors as any)[name]?.message}
            required
          />
        ))}

        <Select
          label="Perfil de acesso"
          value={watchedValues.role}
          onChange={(v) => setValue('role', v as any)}
          options={[
            { value: 'collaborator', label: 'Colaborador' },
            { value: 'admin',        label: 'Admin' },
          ]}
          error={errors.role?.message as string}
        />

        <label className="flex items-center gap-3 cursor-pointer">
          <div
            role="checkbox"
            aria-checked={watchedValues.twoFactorEnabled}
            tabIndex={0}
            onClick={() => setValue('twoFactorEnabled', !watchedValues.twoFactorEnabled)}
            onKeyDown={(e) => e.key === ' ' && setValue('twoFactorEnabled', !watchedValues.twoFactorEnabled)}
            className="w-5 h-5 rounded border-2 border-[var(--color-border-default)] flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer"
            style={watchedValues.twoFactorEnabled ? { background: 'var(--color-green-500)', borderColor: 'var(--color-green-500)' } : {}}
          >
            {watchedValues.twoFactorEnabled && (
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                <path d="M1 4L4 7L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>
          <div>
            <p className="text-[14px] font-bold text-[var(--color-text-primary)]">Autenticação em dois fatores</p>
            <p className="text-[12px] text-[var(--color-text-secondary)]">Usuário precisará confirmar código por e-mail</p>
          </div>
        </label>
      </form>
    </Drawer>
  )
}
