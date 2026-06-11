import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, CheckCircle2, ExternalLink, LogOut } from 'lucide-react'
import { api } from '@/services/api'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { signOut } from '@/services/auth.service'
import { useSnackbar } from '@/components/ui/Snackbar'

export function ContentPage() {
  const { trailId, itemId } = useParams<{ trailId: string; itemId: string }>()
  const navigate = useNavigate()
  const { user, setUser } = useAuth()
  const { show } = useSnackbar()

  const [trail, setTrail]     = useState<any>(null)
  const [item, setItem]       = useState<any>(null)
  const [content, setContent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [completing, setCompleting] = useState(false)
  const [done, setDone]       = useState(false)

  useEffect(() => {
    if (!trailId || !itemId) return

    api.get(`/trails/${trailId}`)
      .then(async (res) => {
        const trailData = res.data.data
        setTrail(trailData)
        const found = trailData?.items?.find((i: any) => i.id === itemId)
        setItem(found)
        if (found?.contentId) {
          const cRes = await api.get(`/contents/${found.contentId}`)
          setContent(cRes.data.data)
        }
        const progressRes = await api.get(`/progress/me/trails/${trailId}`).catch(() => null)
        if (progressRes?.data?.data?.completedItems?.includes(itemId)) setDone(true)
      })
      .finally(() => setLoading(false))
  }, [trailId, itemId])

  const handleComplete = async () => {
    if (!trailId || !itemId || done) return
    setCompleting(true)
    try {
      await api.post('/progress/complete-item', { trailId, itemId })
      setDone(true)
      show({ message: 'Conteúdo marcado como concluído!' })
    } catch (e: any) {
      show({ message: e?.response?.data?.message ?? 'Erro ao marcar como concluído' })
    } finally {
      setCompleting(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    setUser(null)
    navigate('/login', { replace: true })
  }

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
          onClick={() => navigate(`/onboarding/trail/${trailId}`)}
          className="flex items-center gap-1 text-[12px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] mb-6 bg-transparent border-none cursor-pointer p-0"
        >
          <ChevronLeft size={14} /> Voltar para {trail?.title ?? 'trilha'}
        </button>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 rounded-full border-2 border-[var(--color-green-500)] border-t-transparent animate-spin" />
          </div>
        ) : !content ? (
          <div className="bg-[var(--color-surface-default)] rounded-[var(--radius-md)] p-12 text-center shadow-[var(--shadow-elevation)]">
            <p className="text-[16px] font-bold text-[var(--color-text-primary)]">Conteúdo não encontrado</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {/* Content header */}
            <div className="bg-[var(--color-surface-default)] rounded-[var(--radius-md)] p-6 shadow-[var(--shadow-elevation)]">
              <h1 className="text-[20px] font-bold text-[var(--color-text-primary)]">{content.title}</h1>
              {content.description && (
                <p className="text-[13px] text-[var(--color-text-secondary)] mt-2">{content.description}</p>
              )}
            </div>

            {/* Embedded content — gdoc / pdf */}
            {content.url && (item?.type === 'gdoc' || item?.type === 'pdf') && (
              <div className="bg-[var(--color-surface-default)] rounded-[var(--radius-md)] shadow-[var(--shadow-elevation)] overflow-hidden">
                <iframe
                  src={content.url.includes('docs.google.com') ? content.url.replace('/edit', '/preview') : content.url}
                  className="w-full"
                  style={{ height: '70vh', border: 'none' }}
                  title={content.title}
                  allow="autoplay"
                />
              </div>
            )}

            {/* YouTube embed */}
            {item?.type === 'video' && content.youtubeId && (
              <div className="bg-[var(--color-surface-default)] rounded-[var(--radius-md)] shadow-[var(--shadow-elevation)] overflow-hidden aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${content.youtubeId}`}
                  className="w-full h-full"
                  style={{ border: 'none' }}
                  title={content.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}

            {/* Video with direct URL (non-YouTube) */}
            {item?.type === 'video' && !content.youtubeId && content.url && (
              <div className="bg-[var(--color-surface-default)] rounded-[var(--radius-md)] shadow-[var(--shadow-elevation)] overflow-hidden aspect-video">
                <iframe
                  src={content.url}
                  className="w-full h-full"
                  style={{ border: 'none' }}
                  title={content.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}

            {/* Embedded link (external website) */}
            {item?.type === 'link' && content.url && (
              <div className="flex flex-col gap-3">
                <div className="bg-[var(--color-surface-default)] rounded-[var(--radius-md)] shadow-[var(--shadow-elevation)] overflow-hidden">
                  <iframe
                    src={content.url}
                    className="w-full"
                    style={{ height: '70vh', border: 'none' }}
                    title={content.title}
                  />
                </div>
                <p className="text-[12px] text-[var(--color-text-secondary)]">
                  Se o conteúdo não carregar,{' '}
                  <a href={content.url} target="_blank" rel="noopener noreferrer"
                    className="text-[var(--color-text-link)] hover:underline">
                    clique aqui para abrir em nova aba
                  </a>.
                </p>
              </div>
            )}

            {/* Open externally link */}
            {(content.url || content.youtubeId) && (
              <a
                href={content.youtubeId ? `https://www.youtube.com/watch?v=${content.youtubeId}` : content.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[12px] text-[var(--color-text-link)] hover:underline self-start"
              >
                <ExternalLink size={12} /> Abrir em nova aba
              </a>
            )}

            {/* Complete button */}
            {item?.type !== 'quiz' && (
              <div className="bg-[var(--color-surface-default)] rounded-[var(--radius-md)] p-4 shadow-[var(--shadow-elevation)] flex items-center justify-between">
                <div>
                  <p className="text-[14px] font-semibold text-[var(--color-text-primary)]">
                    {done ? 'Conteúdo concluído' : 'Marcar como concluído'}
                  </p>
                  <p className="text-[12px] text-[var(--color-text-secondary)]">
                    {done ? 'Você já concluiu este conteúdo.' : 'Após visualizar o conteúdo, clique para registrar seu progresso.'}
                  </p>
                </div>
                <Button
                  variant={done ? 'secondary' : 'primary'}
                  size="small"
                  disabled={done}
                  loading={completing}
                  iconLeft={done ? <CheckCircle2 size={14} /> : undefined}
                  onClick={handleComplete}
                >
                  {done ? 'Concluído' : 'Concluir'}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
