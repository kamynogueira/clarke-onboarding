import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, Play, FileSpreadsheet, Search, Library, Globe } from 'lucide-react'
import { api } from '@/services/api'
import { Tag } from '@/components/ui/Tag'
import { Button } from '@/components/ui/Button'

type ContentType = 'pdf' | 'video' | 'gdoc' | 'link'

interface Content {
  id: string
  title: string
  description: string
  type: ContentType
  url?: string
  youtubeId?: string
}

const TYPE_LABELS: Record<ContentType, string> = {
  pdf:   'PDF',
  video: 'Vídeo',
  gdoc:  'Google Doc',
  link:  'Link Externo',
}

const TYPE_ICONS: Record<ContentType, React.ReactNode> = {
  pdf:   <FileText size={20} />,
  video: <Play size={20} />,
  gdoc:  <FileSpreadsheet size={20} />,
  link:  <Globe size={20} />,
}

const SORT_OPTIONS = [
  { value: 'newest', label: 'Mais recente' },
  { value: 'oldest', label: 'Mais antigo' },
  { value: 'az',     label: 'A-Z' },
  { value: 'za',     label: 'Z-A' },
]

const TYPE_FILTER_OPTIONS: Array<{ value: ContentType | ''; label: string }> = [
  { value: '',      label: 'Todos' },
  { value: 'pdf',   label: 'PDF' },
  { value: 'video', label: 'Vídeo' },
  { value: 'gdoc',  label: 'Google Doc' },
  { value: 'link',  label: 'Link Externo' },
]

const LIMIT = 20

export function LibraryPage() {
  const navigate = useNavigate()

  const [contents, setContents] = useState<Content[]>([])
  const [total, setTotal]       = useState(0)
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [type, setType]         = useState<ContentType | ''>('')
  const [sort, setSort]         = useState('newest')
  const [offset, setOffset]     = useState(0)

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchContents = (params: {
    search: string
    type: ContentType | ''
    sort: string
    offset: number
  }) => {
    setLoading(true)
    const query = new URLSearchParams({
      sort:   params.sort,
      limit:  String(LIMIT),
      offset: String(params.offset),
    })
    if (params.type)   query.set('type', params.type)
    if (params.search) query.set('search', params.search)

    api.get(`/contents/library?${query}`)
      .then((res) => {
        setContents(res.data.data ?? [])
        setTotal(res.data.total ?? 0)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchContents({ search, type, sort, offset })
  }, [type, sort, offset])

  const handleSearchChange = (value: string) => {
    setSearch(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setOffset(0)
      fetchContents({ search: value, type, sort, offset: 0 })
    }, 300)
  }

  const handleTypeChange = (value: ContentType | '') => {
    setType(value)
    setOffset(0)
  }

  const handleSortChange = (value: string) => {
    setSort(value)
    setOffset(0)
  }

  const totalPages = Math.ceil(total / LIMIT)
  const currentPage = Math.floor(offset / LIMIT) + 1

  return (
    <div className="min-h-screen bg-[var(--color-surface-subtle)] p-6">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-[24px] font-bold text-[var(--color-text-primary)]">Biblioteca</h1>
        <p className="text-[14px] text-[var(--color-text-secondary)] mt-1">
          Explore todos os conteúdos disponíveis
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]" />
          <input
            type="text"
            placeholder="Buscar por título..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-[13px] bg-[var(--color-surface-default)] border border-[var(--color-border-subtle)] rounded-[var(--radius-sm)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:border-[var(--color-green-500)]"
          />
        </div>

        {/* Type filter */}
        <select
          value={type}
          onChange={(e) => handleTypeChange(e.target.value as ContentType | '')}
          className="px-3 py-2 text-[13px] bg-[var(--color-surface-default)] border border-[var(--color-border-subtle)] rounded-[var(--radius-sm)] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-green-500)] cursor-pointer"
        >
          {TYPE_FILTER_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => handleSortChange(e.target.value)}
          className="px-3 py-2 text-[13px] bg-[var(--color-surface-default)] border border-[var(--color-border-subtle)] rounded-[var(--radius-sm)] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-green-500)] cursor-pointer"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Content list */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 rounded-full border-2 border-[var(--color-green-500)] border-t-transparent animate-spin" />
        </div>
      ) : contents.length === 0 ? (
        <div className="bg-[var(--color-surface-default)] rounded-[var(--radius-md)] p-16 text-center shadow-[var(--shadow-elevation)]">
          <Library size={40} className="mx-auto text-[var(--color-text-tertiary)] mb-4" />
          <p className="text-[16px] font-bold text-[var(--color-text-primary)]">Nenhum conteúdo encontrado</p>
          <p className="text-[14px] text-[var(--color-text-secondary)] mt-2">
            Tente ajustar os filtros ou a busca.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {contents.map((content) => (
            <div
              key={content.id}
              className="bg-[var(--color-surface-default)] rounded-[var(--radius-md)] p-5 shadow-[var(--shadow-elevation)] flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-[var(--radius-sm)] bg-[var(--color-green-100)] flex items-center justify-center flex-shrink-0 text-[var(--color-green-500)]">
                {TYPE_ICONS[content.type]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-bold text-[var(--color-text-primary)] truncate">
                  {content.title}
                </p>
                {content.description && (
                  <p className="text-[12px] text-[var(--color-text-secondary)] mt-0.5 truncate">
                    {content.description}
                  </p>
                )}
              </div>
              <Tag theme="gray" size="small">{TYPE_LABELS[content.type]}</Tag>
              <Button
                variant="primary"
                size="small"
                onClick={() => navigate(`/onboarding/library/${content.id}`)}
              >
                Abrir
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-[12px] text-[var(--color-text-secondary)]">
            {total} conteúdo{total !== 1 ? 's' : ''} encontrado{total !== 1 ? 's' : ''}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="small"
              disabled={currentPage === 1}
              onClick={() => setOffset(offset - LIMIT)}
            >
              Anterior
            </Button>
            <span className="text-[12px] text-[var(--color-text-secondary)]">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="secondary"
              size="small"
              disabled={currentPage === totalPages}
              onClick={() => setOffset(offset + LIMIT)}
            >
              Próximo
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
