import { useState } from 'react'
import { Plus, Pencil, Trash2, HelpCircle, Eye } from 'lucide-react'
import { PageHeader }        from '@/components/ui/PageHeader'
import { DataTable, Column } from '@/components/ui/DataTable'
import { Button }            from '@/components/ui/Button'
import { Tag }               from '@/components/ui/Tag'
import { Modal }             from '@/components/ui/Modal'
import { ConfirmModal }      from '@/components/ui/ConfirmModal'
import { useList }           from '@/hooks/useList'
import { useCrud }           from '@/hooks/useCrud'
import { useSnackbar }       from '@/components/ui/Snackbar'
import { QuizForm }          from './QuizForm'

interface QuizOption   { id: string; text: string; isCorrect: boolean }
interface QuizQuestion { id: string; text: string; options: QuizOption[] }
interface Quiz {
  id: string; title: string; passingScore: number
  questions: QuizQuestion[]; createdAt: string
}

export function QuizzesPage() {
  const { show } = useSnackbar()
  const [drawerOpen, setDrawerOpen]     = useState(false)
  const [editingQuiz, setEditingQuiz]   = useState<Quiz | null>(null)
  const [deletingQuiz, setDeletingQuiz] = useState<Quiz | null>(null)
  const [previewQuiz, setPreviewQuiz]   = useState<Quiz | null>(null)

  const list = useList<Quiz>({ endpoint: '/quizzes' })

  const crud = useCrud({
    endpoint: '/quizzes',
    onSuccess: (action) => {
      const msgs = { create: 'Prova criada', update: 'Prova atualizada', delete: 'Prova removida' }
      show({ message: msgs[action] })
      list.refresh(); setDrawerOpen(false); setEditingQuiz(null); setDeletingQuiz(null)
    },
    onError: (msg) => show({ message: msg }),
  })

  const columns: Column<Quiz>[] = [
    {
      key: 'title', header: 'Prova',
      render: (q) => (
        <div>
          <p className="text-[14px] font-bold text-[var(--color-text-primary)]">{q.title}</p>
          <p className="text-[12px] text-[var(--color-text-secondary)]">{q.questions?.length ?? 0} questão{(q.questions?.length ?? 0) !== 1 ? 'ões' : ''}</p>
        </div>
      ),
    },
    {
      key: 'passingScore', header: 'Aprovação', width: '110px',
      render: (q) => <Tag theme={q.passingScore >= 70 ? 'green' : 'yellow'} size="small">{q.passingScore}%</Tag>,
    },
    {
      key: 'createdAt', header: 'Criada em', width: '110px',
      render: (q) => <span className="text-[12px] text-[var(--color-text-secondary)]">{new Date(q.createdAt).toLocaleDateString('pt-BR')}</span>,
    },
    {
      key: 'actions', header: '', width: '110px',
      render: (q) => (
        <div className="flex items-center gap-1">
          <button onClick={() => setPreviewQuiz(q)} aria-label={`Visualizar ${q.title}`}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--color-text-tertiary)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-action-blue)] transition-colors">
            <Eye size={15} />
          </button>
          <button onClick={() => { setEditingQuiz(q); setDrawerOpen(true) }} aria-label={`Editar ${q.title}`}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--color-text-tertiary)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text-primary)] transition-colors">
            <Pencil size={15} />
          </button>
          <button onClick={() => setDeletingQuiz(q)} aria-label={`Excluir ${q.title}`}
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
        title="Provas"
        subtitle={`${list.total} prova${list.total !== 1 ? 's' : ''} cadastrada${list.total !== 1 ? 's' : ''}`}
        action={
          <Button variant="primary" size="medium" iconLeft={<Plus size={16} />}
            onClick={() => { setEditingQuiz(null); setDrawerOpen(true) }}>
            Nova prova
          </Button>
        }
      />

      <DataTable columns={columns} data={list.data} loading={list.loading}
        total={list.total} page={list.page} pageSize={list.pageSize}
        onPageChange={list.setPage} rowKey={(q) => q.id}
        emptyMessage="Nenhuma prova encontrada" emptyIcon={<HelpCircle size={36} />} />

      <QuizForm open={drawerOpen} onClose={() => { setDrawerOpen(false); setEditingQuiz(null) }}
        onSubmit={async (data) => { if (editingQuiz) await crud.update(editingQuiz.id, data); else await crud.create(data) }}
        saving={crud.saving} quiz={editingQuiz} />

      {/* Preview modal */}
      <Modal
        open={!!previewQuiz} onClose={() => setPreviewQuiz(null)}
        size="medium" title={previewQuiz?.title ?? ''}
        scrollable
        primaryAction={{ label: 'Fechar', onClick: () => setPreviewQuiz(null), variant: 'secondary' }}
      >
        <div className="flex flex-col gap-4 text-left">
          <p className="text-[12px] text-[var(--color-text-secondary)]">
            Nota de aprovação: <strong>{previewQuiz?.passingScore}%</strong> · {previewQuiz?.questions?.length} questão{(previewQuiz?.questions?.length ?? 0) !== 1 ? 'ões' : ''}
          </p>
          {previewQuiz?.questions?.map((q, qi) => (
            <div key={q.id} className="flex flex-col gap-2">
              <p className="text-[14px] font-bold text-[var(--color-text-primary)]">{qi + 1}. {q.text}</p>
              {q.options.map((opt) => (
                <div key={opt.id} className={[
                  'flex items-center gap-2 px-3 py-2 rounded-[var(--radius-sm)]',
                  opt.isCorrect
                    ? 'bg-[var(--color-green-100)] border border-[var(--color-green-500)]'
                    : 'bg-[var(--color-surface-muted)] border border-transparent',
                ].join(' ')}>
                  <div className={['w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center',
                    opt.isCorrect ? 'border-[var(--color-green-500)] bg-[var(--color-green-500)]' : 'border-[var(--color-border-default)]',
                  ].join(' ')}>
                    {opt.isCorrect && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                  <p className={['text-[12px]', opt.isCorrect ? 'font-bold text-[var(--color-green-500)]' : 'text-[var(--color-text-secondary)]'].join(' ')}>
                    {opt.text}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </Modal>

      <ConfirmModal open={!!deletingQuiz} onClose={() => setDeletingQuiz(null)}
        onConfirm={async () => { if (deletingQuiz) await crud.remove(deletingQuiz.id) }}
        loading={!!crud.deleting}
        description={`Tem certeza que deseja excluir "${deletingQuiz?.title}"?`} />
    </div>
  )
}
