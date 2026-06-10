import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { BookOpen, ChevronLeft, ChevronRight, FileText, Play, HelpCircle, LogOut, CheckCircle2 } from 'lucide-react'
import { api } from '@/services/api'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { Tag } from '@/components/ui/Tag'
import { signOut } from '@/services/auth.service'
import { useSnackbar } from '@/components/ui/Snackbar'

const TYPE_ICON: Record<string, React.ReactNode> = {
  gdoc:  <FileText size={18} />,
  pdf:   <FileText size={18} />,
  video: <Play size={18} />,
  quiz:  <HelpCircle size={18} />,
}

const TYPE_LABEL: Record<string, string> = {
  gdoc:  'Documento',
  pdf:   'PDF',
  video: 'Vídeo',
  quiz:  'Quiz',
}

export function TrailPage() {
  const { trailId } = useParams<{ trailId: string }>()
  const navigate = useNavigate()
  const { user, setUser } = useAuth()
  const { show } = useSnackbar()

  const [trail, setTrail]       = useState<any>(null)
  const [contents, setContents] = useState<Record<string, any>>({})
  const [progress, setProgress] = useState<any>(null)
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    if (!trailId) return

    Promise.all([
      api.get(`/trails/${trailId}`),
      api.get(`/progress/me/trails/${trailId}`).catch(() => ({ data: { data: null } })),
    ]).then(async ([trailRes, progressRes]) => {
      const trailData = trailRes.data.data
      setTrail(trailData)
      setProgress(progressRes.data.data)

      if (trailData?.items?.length) {
        const contentMap: Record<string, any> = {}
        await Promise.all(
          trailData.items.map((item: any) =>
            api.get(`/contents/${item.contentId}`)
              .then((r) => { contentMap[item.contentId] = r.data.data })
              .catch(() => { contentMap[item.contentId] = { title: 'Conteúdo', type: item.type } })
          )
        )
        setContents(contentMap)
      }
    }).finally(() => setLoading(false))
  }, [trailId])

  const handleSignOut = async () => {
    await signOut()
    setUser(null)
    navigate('/login', { replace: true })
    show({ message: 'Sessão encerrada com sucesso' })
  }

  const isCompleted = (itemId: string) =>
    progress?.items?.some((i: any) => i.itemId === itemId && i.status === 'completed') ?? false

  const percent = progress?.percentComplete ?? 0

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

      <div className="max-w-3xl mx-auto p-6">
        <button
          onClick={() => navigate('/onboarding')}
          className="flex items-center gap-1 text-[12px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] mb-6 bg-transparent border-none cursor-pointer p-0"
        >
          <ChevronLeft size={14} /> Voltar para trilhas
        </button>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 rounded-full border-2 border-[var(--color-green-500)] border-t-transparent animate-spin" />
          </div>
        ) : !trail ? (
          <div className="bg-[var(--color-surface-default)] rounded-[var(--radius-md)] p-12 text-center shadow-[var(--shadow-elevation)]">
            <p className="text-[16px] font-bold text-[var(--color-text-primary)]">Trilha não encontrada</p>
          </div>
        ) : (
          <>
            {/* Trail header */}
            <div className="bg-[var(--color-surface-default)] rounded-[var(--radius-md)] p-6 shadow-[var(--shadow-elevation)] mb-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-[var(--radius-sm)] bg-[var(--color-green-100)] flex items-center justify-center flex-shrink-0 text-[var(--color-green-500)]">
                  <BookOpen size={22} />
                </div>
                <div className="flex-1">
                  <h1 className="text-[20px] font-bold text-[var(--color-text-primary)]">{trail.title}</h1>
                  {trail.description && (
                    <p className="text-[13px] text-[var(--color-text-secondary)] mt-1">{trail.description}</p>
                  )}
                  {/* Progress bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] text-[var(--color-text-secondary)]">Progresso</span>
                      <span className="text-[11px] font-bold text-[var(--color-text-primary)]">{percent}%</span>
                    </div>
                    <div className="h-1.5 bg-[var(--color-border-subtle)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[var(--color-green-500)] rounded-full transition-all duration-300"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Items */}
            {trail.items?.length === 0 ? (
              <div className="bg-[var(--color-surface-default)] rounded-[var(--radius-md)] p-12 text-center shadow-[var(--shadow-elevation)]">
                <p className="text-[14px] text-[var(--color-text-secondary)]">Nenhum conteúdo nesta trilha ainda.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {[...(trail.items ?? [])].sort((a: any, b: any) => a.order - b.order).map((item: any, idx: number) => {
                  const content = contents[item.contentId]
                  const done = isCompleted(item.id)
                  return (
                    <div
                      key={item.id}
                      className="bg-[var(--color-surface-default)] rounded-[var(--radius-md)] p-4 shadow-[var(--shadow-elevation)] flex items-center gap-4"
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-[12px] font-bold ${done ? 'bg-[var(--color-green-500)] text-[var(--color-text-on-brand)]' : 'bg-[var(--color-surface-muted)] text-[var(--color-text-secondary)]'}`}>
                        {done ? <CheckCircle2 size={16} /> : idx + 1}
                      </div>

                      <div className="flex-shrink-0 text-[var(--color-text-secondary)]">
                        {TYPE_ICON[item.type] ?? <FileText size={18} />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-semibold text-[var(--color-text-primary)] truncate">
                          {content?.title ?? 'Carregando...'}
                        </p>
                        <p className="text-[11px] text-[var(--color-text-secondary)]">
                          {TYPE_LABEL[item.type] ?? item.type}
                        </p>
                      </div>

                      {done ? (
                        <Tag theme="green" size="small">Concluído</Tag>
                      ) : (
                        <Button
                          variant="primary"
                          size="small"
                          iconRight={<ChevronRight size={14} />}
                          onClick={() => navigate(`/onboarding/trail/${trailId}/content/${item.id}`)}
                        >
                          Abrir
                        </Button>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
