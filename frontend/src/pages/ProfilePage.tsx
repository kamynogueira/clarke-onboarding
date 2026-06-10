import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ChevronLeft, Eye, EyeOff, LogOut } from 'lucide-react'
import { api } from '@/services/api'
import { useAuth } from '@/contexts/AuthContext'
import { changePassword, refreshCurrentUser, signOut } from '@/services/auth.service'
import { Button } from '@/components/ui/Button'
import { TextField } from '@/components/ui/TextField'
import { useSnackbar } from '@/components/ui/Snackbar'

const profileSchema = z.object({
  name:      z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
  phone:     z.string().min(10, 'Telefone inválido'),
  position:  z.string().optional(),
  team:      z.string().optional(),
  startDate: z.string().optional(),
})

const passwordSchema = z.object({
  newPassword:     z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
  confirmPassword: z.string().min(6, 'Confirme a senha'),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
})

type ProfileFormData  = z.infer<typeof profileSchema>
type PasswordFormData = z.infer<typeof passwordSchema>

export function ProfilePage() {
  const navigate = useNavigate()
  const { user, setUser } = useAuth()
  const { show } = useSnackbar()

  const [profile, setProfile]         = useState<any>(null)
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [savingProfile, setSavingProfile]   = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const [showNew, setShowNew]               = useState(false)
  const [showConfirm, setShowConfirm]       = useState(false)

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: '', phone: '', position: '', team: '', startDate: '' },
  })

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { newPassword: '', confirmPassword: '' },
  })

  const profileValues  = profileForm.watch()
  const passwordValues = passwordForm.watch()

  useEffect(() => {
    api.get('/users/me')
      .then((res) => {
        const p = res.data.data ?? res.data
        setProfile(p)
        profileForm.reset({
          name:      p.name      ?? '',
          phone:     p.phone     ?? '',
          position:  p.position  ?? '',
          team:      p.team      ?? '',
          startDate: p.startDate ?? '',
        })
      })
      .finally(() => setLoadingProfile(false))
  }, [])

  const handleSaveProfile = async (data: ProfileFormData) => {
    setSavingProfile(true)
    try {
      await api.patch('/users/me', data)
      const refreshed = await refreshCurrentUser()
      if (refreshed) setUser(refreshed)
      show({ message: 'Perfil atualizado com sucesso' })
    } catch (err: any) {
      show({ message: err?.response?.data?.message ?? 'Erro ao salvar perfil' })
    } finally {
      setSavingProfile(false)
    }
  }

  const handleChangePassword = async (data: PasswordFormData) => {
    setSavingPassword(true)
    try {
      await changePassword(data.newPassword)
      passwordForm.reset()
      show({ message: 'Senha alterada com sucesso' })
    } catch (err: any) {
      show({ message: err?.response?.data?.message ?? 'Erro ao alterar senha' })
    } finally {
      setSavingPassword(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    setUser(null)
    navigate('/login', { replace: true })
  }

  const backPath = user?.role === 'admin' ? '/admin' : '/onboarding'
  const isAdmin  = user?.role === 'admin'

  return (
    <div className="min-h-screen bg-[var(--color-surface-subtle)]">
      <header className="bg-[var(--color-surface-default)] border-b border-[var(--color-border-subtle)] px-6 py-4 flex items-center justify-between shadow-[var(--shadow-elevation)]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[var(--color-green-500)] flex items-center justify-center">
            <span className="text-[var(--color-text-on-brand)] font-extrabold text-[14px]">C</span>
          </div>
          <span className="text-[16px] font-bold text-[var(--color-text-primary)]">Clarke Onboarding</span>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-[12px] text-[var(--color-text-secondary)] hidden sm:block">{user?.name}</p>
          <Button variant="tertiary" size="small" iconLeft={<LogOut size={14} />} onClick={handleSignOut}>
            Sair
          </Button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto p-6">
        <button
          onClick={() => navigate(backPath)}
          className="flex items-center gap-1 text-[12px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] mb-6 bg-transparent border-none cursor-pointer p-0"
        >
          <ChevronLeft size={14} /> Voltar
        </button>

        <h1 className="text-[24px] font-bold text-[var(--color-text-primary)] mb-6">Meu Perfil</h1>

        {loadingProfile ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 rounded-full border-2 border-[var(--color-green-500)] border-t-transparent animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Profile data */}
            <div className="bg-[var(--color-surface-default)] rounded-[var(--radius-md)] p-6 shadow-[var(--shadow-elevation)]">
              <h2 className="text-[16px] font-bold text-[var(--color-text-primary)] mb-5">Dados pessoais</h2>
              <form onSubmit={profileForm.handleSubmit(handleSaveProfile)} noValidate className="flex flex-col gap-4">
                <TextField
                  label="Nome completo"
                  value={profileValues.name}
                  onChange={(v) => profileForm.setValue('name', v)}
                  error={profileForm.formState.errors.name?.message}
                  required
                />

                <TextField
                  label="E-mail"
                  value={profile?.email ?? ''}
                  onChange={() => {}}
                  disabled
                />

                <TextField
                  label="Telefone"
                  value={profileValues.phone}
                  onChange={(v) => profileForm.setValue('phone', v)}
                  error={profileForm.formState.errors.phone?.message}
                  required
                />

                {isAdmin ? (
                  <>
                    <TextField
                      label="Cargo"
                      value={profileValues.position ?? ''}
                      onChange={(v) => profileForm.setValue('position', v)}
                    />
                    <TextField
                      label="Time"
                      value={profileValues.team ?? ''}
                      onChange={(v) => profileForm.setValue('team', v)}
                    />
                    <TextField
                      label="Data de entrada"
                      type="date"
                      value={profileValues.startDate ?? ''}
                      onChange={(v) => profileForm.setValue('startDate', v)}
                    />
                  </>
                ) : (
                  <>
                    <TextField
                      label="Cargo"
                      value={profile?.position ?? '—'}
                      onChange={() => {}}
                      disabled
                    />
                    <TextField
                      label="Time"
                      value={profile?.team ?? '—'}
                      onChange={() => {}}
                      disabled
                    />
                    <TextField
                      label="Data de entrada"
                      value={profile?.startDate ? new Date(profile.startDate).toLocaleDateString('pt-BR') : '—'}
                      onChange={() => {}}
                      disabled
                    />
                  </>
                )}

                <div className="flex justify-end mt-2">
                  <Button type="submit" variant="primary" size="medium" loading={savingProfile}>
                    Salvar alterações
                  </Button>
                </div>
              </form>
            </div>

            {/* Password */}
            <div className="bg-[var(--color-surface-default)] rounded-[var(--radius-md)] p-6 shadow-[var(--shadow-elevation)]">
              <h2 className="text-[16px] font-bold text-[var(--color-text-primary)] mb-5">Alterar senha</h2>
              <form onSubmit={passwordForm.handleSubmit(handleChangePassword)} noValidate className="flex flex-col gap-4">
                <TextField
                  label="Nova senha"
                  type={showNew ? 'text' : 'password'}
                  placeholder="Mínimo 6 caracteres"
                  value={passwordValues.newPassword}
                  onChange={(v) => passwordForm.setValue('newPassword', v)}
                  error={passwordForm.formState.errors.newPassword?.message}
                  icon={
                    <button type="button" onClick={() => setShowNew((p) => !p)}
                      className="cursor-pointer bg-transparent border-none p-0 flex items-center">
                      {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  }
                  required
                />

                <TextField
                  label="Confirmar nova senha"
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Repita a senha"
                  value={passwordValues.confirmPassword}
                  onChange={(v) => passwordForm.setValue('confirmPassword', v)}
                  error={passwordForm.formState.errors.confirmPassword?.message}
                  icon={
                    <button type="button" onClick={() => setShowConfirm((p) => !p)}
                      className="cursor-pointer bg-transparent border-none p-0 flex items-center">
                      {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  }
                  required
                />

                <div className="flex justify-end mt-2">
                  <Button type="submit" variant="primary" size="medium" loading={savingPassword}>
                    Alterar senha
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
