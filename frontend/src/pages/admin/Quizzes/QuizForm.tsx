import { useEffect, useState } from 'react'
import { Plus, Trash2, CheckCircle } from 'lucide-react'
import { useForm }   from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z }         from 'zod'
import { TextField } from '@/components/ui/TextField'
import { Button }    from '@/components/ui/Button'
import { Drawer }    from '@/components/ui/Drawer'
import clsx          from 'clsx'

const schema = z.object({
  title:        z.string().min(2, 'Título obrigatório'),
  passingScore: z.coerce.number().min(0).max(100),
})
type FormData = z.infer<typeof schema>

interface Option   { id: string; text: string; isCorrect: boolean }
interface Question { id: string; text: string; options: Option[] }

function genId() { return Math.random().toString(36).slice(2, 9) }

function makeOption(text = '', isCorrect = false): Option {
  return { id: genId(), text, isCorrect }
}
function makeQuestion(): Question {
  return { id: genId(), text: '', options: [makeOption('', true), makeOption()] }
}

interface QuizFormProps {
  open: boolean; onClose: () => void
  onSubmit: (data: any) => Promise<void>; saving: boolean; quiz?: any
}

export function QuizForm({ open, onClose, onSubmit, saving, quiz }: QuizFormProps) {
  const isEdit = !!quiz
  const [questions, setQuestions] = useState<Question[]>([makeQuestion()])
  const [qErrors, setQErrors]     = useState<string[]>([])

  const { handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { title: '', passingScore: 70 },
  })
  const w = watch()

  useEffect(() => {
    if (quiz) {
      reset({ title: quiz.title, passingScore: quiz.passingScore })
      setQuestions(quiz.questions?.length ? quiz.questions : [makeQuestion()])
    } else {
      reset({ title: '', passingScore: 70 })
      setQuestions([makeQuestion()])
    }
    setQErrors([])
  }, [quiz, reset])

  const addQuestion = () => setQuestions([...questions, makeQuestion()])

  const removeQuestion = (qIndex: number) =>
    setQuestions(questions.filter((_, i) => i !== qIndex))

  const updateQuestionText = (qIndex: number, text: string) => {
    const next = [...questions]
    next[qIndex] = { ...next[qIndex], text }
    setQuestions(next)
  }

  const addOption = (qIndex: number) => {
    const next = [...questions]
    next[qIndex].options.push(makeOption())
    setQuestions(next)
  }

  const removeOption = (qIndex: number, oIndex: number) => {
    const next = [...questions]
    next[qIndex].options = next[qIndex].options.filter((_, i) => i !== oIndex)
    setQuestions(next)
  }

  const updateOptionText = (qIndex: number, oIndex: number, text: string) => {
    const next = [...questions]
    next[qIndex].options[oIndex].text = text
    setQuestions(next)
  }

  const setCorrect = (qIndex: number, oIndex: number) => {
    const next = [...questions]
    next[qIndex].options = next[qIndex].options.map((o, i) => ({ ...o, isCorrect: i === oIndex }))
    setQuestions(next)
  }

  const validate = (): boolean => {
    const errs = questions.map((q, qi) => {
      if (!q.text.trim()) return `Questão ${qi + 1}: enunciado obrigatório`
      if (q.options.length < 2) return `Questão ${qi + 1}: ao menos 2 opções`
      if (q.options.some((o) => !o.text.trim())) return `Questão ${qi + 1}: todas as opções precisam ter texto`
      if (!q.options.some((o) => o.isCorrect)) return `Questão ${qi + 1}: selecione a resposta correta`
      return ''
    })
    setQErrors(errs)
    return errs.every((e) => !e)
  }

  const handleFormSubmit = (data: FormData) => {
    if (!validate()) return
    onSubmit({ ...data, questions })
  }

  return (
    <Drawer open={open} onClose={onClose} width="600px"
      title={isEdit ? 'Editar prova' : 'Nova prova'}
      subtitle="Configure as questões e alternativas"
      footer={
        <>
          <Button variant="secondary" size="medium" onClick={onClose} disabled={saving}>Cancelar</Button>
          <Button variant="primary" size="medium" loading={saving} onClick={handleSubmit(handleFormSubmit)}>
            {isEdit ? 'Salvar alterações' : 'Criar prova'}
          </Button>
        </>
      }
    >
      <form className="flex flex-col gap-6" noValidate>
        <div className="grid grid-cols-2 gap-4">
          <TextField label="Título da prova" placeholder="Ex: Prova de Onboarding"
            value={w.title} onChange={(v) => setValue('title', v)}
            error={errors.title?.message} required />
          <TextField label="Nota de aprovação (%)" type="number" placeholder="70"
            value={String(w.passingScore)} onChange={(v) => setValue('passingScore', Number(v))}
            error={errors.passingScore?.message} helper="Percentual mínimo para aprovação" />
        </div>

        {/* Questões */}
        <div className="flex flex-col gap-5">
          {questions.map((q, qi) => (
            <div key={q.id}
              className="border border-[var(--color-border-default)] rounded-[var(--radius-sm)] p-4 flex flex-col gap-4">
              {/* Cabeçalho da questão */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-[12px] font-bold text-[var(--color-text-secondary)]">
                  Questão {qi + 1}
                </span>
                {questions.length > 1 && (
                  <button type="button" onClick={() => removeQuestion(qi)} aria-label={`Remover questão ${qi + 1}`}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[var(--color-text-tertiary)] hover:bg-[var(--color-feedback-error-bg)] hover:text-[var(--color-text-danger)] transition-colors">
                    <Trash2 size={14} />
                  </button>
                )}
              </div>

              <TextField label="Enunciado" placeholder="Ex: Qual é a missão da Clarke Energia?"
                value={q.text} onChange={(text) => updateQuestionText(qi, text)}
                error={qErrors[qi] && !q.text ? qErrors[qi] : undefined} required />

              {/* Opções */}
              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-bold text-[var(--color-text-primary)]">
                  Alternativas <span className="text-[12px] font-normal text-[var(--color-text-secondary)]">(clique no ✓ para marcar a correta)</span>
                </label>
                {q.options.map((opt, oi) => (
                  <div key={opt.id} className="flex items-center gap-2">
                    <button type="button" onClick={() => setCorrect(qi, oi)} aria-label={`Marcar opção ${oi + 1} como correta`}
                      className={clsx(
                        'w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center border-2 transition-colors',
                        opt.isCorrect
                          ? 'bg-[var(--color-green-500)] border-[var(--color-green-500)] text-white'
                          : 'border-[var(--color-border-default)] text-transparent hover:border-[var(--color-green-500)]',
                      )}>
                      <CheckCircle size={14} />
                    </button>
                    <div className="flex-1">
                      <TextField label="" placeholder={`Alternativa ${oi + 1}`}
                        value={opt.text} onChange={(text) => updateOptionText(qi, oi, text)} />
                    </div>
                    {q.options.length > 2 && (
                      <button type="button" onClick={() => removeOption(qi, oi)} aria-label={`Remover alternativa ${oi + 1}`}
                        className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[var(--color-text-tertiary)] hover:text-[var(--color-text-danger)] transition-colors">
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={() => addOption(qi)}
                  className="flex items-center gap-1 text-[12px] text-[var(--color-text-link)] hover:underline mt-1 w-fit">
                  <Plus size={12} /> Adicionar alternativa
                </button>
              </div>

              {qErrors[qi] && (
                <p className="text-[10px] text-[var(--color-text-danger)]">{qErrors[qi]}</p>
              )}
            </div>
          ))}
        </div>

        <Button type="button" variant="secondary" size="small" iconLeft={<Plus size={14} />}
          onClick={addQuestion}>
          Adicionar questão
        </Button>
      </form>
    </Drawer>
  )
}
