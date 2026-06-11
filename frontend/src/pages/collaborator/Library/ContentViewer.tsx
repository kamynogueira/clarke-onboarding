import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, ExternalLink, LogOut } from 'lucide-react'
import { api } from '@/services/api'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { signOut } from '@/services/auth.service'
import { useSnackbar } from '@/components/ui/Snackbar'

export function LibraryContentViewer() {
  const { contentId } = useParams<{ contentId: string }>()
  const navigate = useNavigate()
  const { user, setUser } = useAuth()
  const { show } = useSnackbar()

  const [content, setContent] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!contentId) return
    api.get(`/contents/${contentId}`)
      .then((res) => setContent(res.data.data))
      .finally(() => setLoading(false))
  }, [contentId])

  const handleSignOut = async () => {
    await signOut()
    setUser(null)
    navigate('/login', { replace: true })
    show({ message: 'Sessão encerrada com sucesso' })
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
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-[12px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] mb-6 bg-transparent border-none cursor-pointer p-0"
        >
          <ChevronLeft size={14} /> Voltar para Biblioteca
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

            {/* PDF or GDoc embed */}
            {content.url && (content.type === 'gdoc' || content.type === 'pdf') && (
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
            {content.type === 'video' && content.youtubeId && (
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

            {/* Direct URL video */}
            {content.type === 'video' && !content.youtubeId && content.url && (
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
            {content.type === 'link' && content.url && (
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

            {/* External link */}
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
          </div>
        )}
      </div>
    </div>
  )
}
