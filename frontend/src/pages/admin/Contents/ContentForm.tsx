import { useEffect } from 'react'
import { useForm }   from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { TextField } from '@/components/ui/TextField'
import { Select }    from '@/components/ui/Select'
import { Button }    from '@/components/ui/Button'
import { Drawer }    from '@/components/ui/Drawer'

const baseSchema = z.object({
  title:       z.string().min(2, 'Título obrigatório'),
  description: z.string().min(5, 'Descrição obrigatória'),
  type:        z.enum(['pdf', 'video', 'gdoc', 'quiz']),
  url:         z.string().optional(),
  youtubeId:   z.string().optional(),
  quizId:      z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.type === 'pdf'   && !data.url)       ctx.addIssue({ code: 'custom', path: ['url'],       message: 'URL do PDF obrigatória' })
  if (data.type === 'gdoc'  && !data.url)       ctx.addIssue({ code: 'custom', path: ['url'],       message: 'URL do Google Drive obrigatória' })
  if (data.type === 'video' && !data.youtubeId) ctx.addIssue({ code: 'custom', path: ['youtubeId'], message: 'ID do YouTube obrigatório' })
  if (data.type === 'quiz'  && !data.quizId)    ctx.addIssue({ code: 'custom', path: ['quizId'],    message: 'ID da prova obrigatório' })
})

type FormData = z.infer<typeof baseSchema>

interface ContentFormProps {
  open: boolean; onClose: () => void
  onSubmit: (data: FormData) => Promise<void>; saving: boolean; content?: any
}

const typeOptions = [
  { value: 'pdf',   label: 'PDF' },
  { value: 'video', label: 'Vídeo (YouTube)' },
  { value: 'gdoc',  label: 'Google Drive' },
  { value: 'quiz',  label: 'Prova' },
]

export function ContentForm({ open, onClose, onSubmit, saving, content }: ContentFormProps) {
  const isEdit = !!content

  const { handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(baseSchema),
    defaultValues: { title: '', description: '', type: 'pdf', url: '', youtubeId: '', quizId: '' },
  })

  useEffect(() => {
    if (content) reset({ title: content.title, description: content.description, type: content.type, url: content.url ?? '', youtubeId: content.youtubeId ?? '', quizId: content.quizId ?? '' })
    else reset({ title: '', description: '', type: 'pdf', url: '', youtubeId: '', quizId: '' })
  }, [content, reset])

  const w = watch()

  const extraFieldByType: Record<string, { name: 'url' | 'youtubeId' | 'quizId'; label: string; placeholder: string; helper?: string }> = {
    pdf:   { name: 'url',       label: 'URL do PDF',           placeholder: 'https://...',                   helper: 'Link público do arquivo PDF' },
    gdoc:  { name: 'url',       label: 'URL do Google Drive',  placeholder: 'https://drive.google.com/...',  helper: 'Compartilhe o link com permissão de visualização' },
    video: { name: 'youtubeId', label: 'ID do YouTube',        placeholder: 'dQw4w9WgXcQ',                   helper: 'Ex: dQw4w9WgXcQ (parte da URL após ?v=)' },
    quiz:  { name: 'quizId',    label: 'ID da Prova',          placeholder: 'ID da prova cadastrada',        helper: 'Copie o ID da prova criada na seção Provas' },
  }

  const extraField = extraFieldByType[w.type]

  return (
    <Drawer
      open={open} onClose={onClose}
      title={isEdit ? 'Editar conteúdo' : 'Novo conteúdo'}
      subtitle="Configure o conteúdo da trilha"
      footer={
        <>
          <Button variant="secondary" size="medium" onClick={onClose} disabled={saving}>Cancelar</Button>
          <Button variant="primary" size="medium" loading={saving} onClick={handleSubmit(onSubmit)}>
            {isEdit ? 'Salvar alterações' : 'Criar conteúdo'}
          </Button>
        </>
      }
    >
      <form className="flex flex-col gap-5" noValidate>
        <TextField label="Título" placeholder="Ex: Apresentação da empresa"
          value={w.title} onChange={(v) => setValue('title', v)}
          error={errors.title?.message} required />

        <div className="flex flex-col gap-1">
          <label className="text-[12px] font-bold text-[var(--color-text-primary)]">Descrição <span className="text-[var(--color-text-danger)]">*</span></label>
          <textarea value={w.description} onChange={(e) => setValue('description', e.target.value)}
            placeholder="Descreva o que o colaborador vai aprender…" rows={3}
            className={[
              'w-full px-[14px] py-[10px] rounded-[var(--radius-sm)]',
              'border-[1.5px] outline-none resize-none',
              'font-[var(--font-family-base)] text-[12px] text-[var(--color-text-primary)]',
              'placeholder:text-[var(--color-text-disabled)]',
              'transition-[border-color,background-color] duration-[150ms]',
              w.description ? 'bg-[var(--color-surface-default)] border-[var(--color-border-default)]' : 'bg-[var(--color-surface-muted)] border-transparent',
              'focus:bg-[var(--color-surface-default)] focus:border-[var(--color-border-focus)]',
              errors.description ? 'border-[var(--color-border-error)]' : '',
            ].join(' ')} />
          {errors.description && <span className="text-[10px] text-[var(--color-text-danger)] pl-1">{errors.description.message}</span>}
        </div>

        <Select label="Tipo de conteúdo" value={w.type}
          onChange={(v) => setValue('type', v as any)}
          options={typeOptions} />

        {extraField && (
          <TextField
            label={extraField.label}
            placeholder={extraField.placeholder}
            helper={extraField.helper}
            value={(w as any)[extraField.name] ?? ''}
            onChange={(v) => setValue(extraField.name, v)}
            error={(errors as any)[extraField.name]?.message}
            required
          />
        )}

        {w.type === 'video' && w.youtubeId && (
          <div className="rounded-[var(--radius-sm)] overflow-hidden aspect-video bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${w.youtubeId}`}
              title="Preview do vídeo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        )}
      </form>
    </Drawer>
  )
}
