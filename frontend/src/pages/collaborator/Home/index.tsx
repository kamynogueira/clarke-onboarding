import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, ChevronRight, LogOut } from 'lucide-react'
import { api } from '@/services/api'
import { useAuth } from '@/contexts/AuthContext'
import { Tag } from '@/components/ui/Tag'
import { Button } from '@/components/ui/Button'
import { signOut } from '@/services/auth.service'
import { useSnackbar } from '@/components/ui/Snackbar'

export function OnboardingHome() {
  const { user, setUser } = useAuth()
  const navigate = useNavigate()
  const { show }  = useSnackbar()
  const [trails, setTrails]   = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/trails/my')
      .then((res) => setTrails(res.data.data ?? []))
      .finally(() => setLoading(false))
  }, [])

  const handleSignOut = async () => {
    await signOut()
    setUser(null)
    navigate('/login', { replace: true })
    show({ message: 'Sessão encerrada com sucesso' })
  }

  return (
    <div className="min-h-screen bg-[var(--color-surface-subtle)]">
      {/* Header */}
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

      {/* Content */}
      <div className="max-w-3xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-[28px] font-bold text-[var(--color-text-primary)]">
            Olá, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-[14px] text-[var(--color-text-secondary)] mt-1">
            Continue de onde parou nas suas trilhas de onboarding
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 rounded-full border-2 border-[var(--color-green-500)] border-t-transparent animate-spin" />
          </div>
        ) : trails.length === 0 ? (
          <div className="bg-[var(--color-surface-default)] rounded-[var(--radius-md)] p-12 text-center shadow-[var(--shadow-elevation)]">
            <BookOpen size={40} className="mx-auto text-[var(--color-text-tertiary)] mb-4" />
            <p className="text-[16px] font-bold text-[var(--color-text-primary)]">Nenhuma trilha atribuída</p>
            <p className="text-[14px] text-[var(--color-text-secondary)] mt-2">
              Entre em contato com o RH para mais informações.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {trails.map((trail: any) => (
              <div
                key={trail.id}
                className="bg-[var(--color-surface-default)] rounded-[var(--radius-md)] p-6 shadow-[var(--shadow-elevation)] flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-[var(--radius-sm)] bg-[var(--color-green-100)] flex items-center justify-center flex-shrink-0 text-[var(--color-green-500)]">
                  <BookOpen size={22} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[16px] font-bold text-[var(--color-text-primary)] truncate">
                    {trail.title}
                  </p>
                  <p className="text-[12px] text-[var(--color-text-secondary)] mt-0.5">
                    {trail.items?.length ?? 0} conteúdo{trail.items?.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <Tag theme="green" size="small">Disponível</Tag>
                <Button
                  variant="primary"
                  size="small"
                  iconRight={<ChevronRight size={14} />}
                  onClick={() => navigate(`/onboarding/trail/${trail.id}`)}
                >
                  Acessar
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
