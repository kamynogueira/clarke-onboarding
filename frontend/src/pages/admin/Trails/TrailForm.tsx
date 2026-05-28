import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Plus } from 'lucide-react'
import { TextField }  from '@/components/ui/TextField'
import { Select }     from '@/components/ui/Select'
import { Button }     from '@/components/ui/Button'
import { Tag }        from '@/components/ui/Tag'
import { Drawer }     from '@/components/ui/Drawer'
import { api }        from '@/services/api'

const schema = z.object({
  title:              z.string().min(2, 'Título obrigatório'),
  description:        z.string().min(10, 'Descrição deve ter ao menos 10 caracteres'),
  status:             z.enum(['draft', 'published']),
  minScoreToAdvance:  z.coerce.number().min(0).max(100),
})

type FormData = z.infer<typeof schema>

interface TrailFormProps {
  open: boolean; onClose: () => void
  onSubmit: (data: any) => Promise<void>; saving: boolean; trail?: any
}

export function TrailForm({ open, onClose, onSubmit, saving, trail }: TrailFormProps) {
  const isEdit = !!trail

  const { handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { title: '', description: '', status: 'draft', minScoreToAdvance: 70 },
  })

  const [teams,      setTeams]      = useState<string[]>([])
  const [positions,  setPositions]  = useState<string[]>([])
  const [selTeams,   setSelTeams]   = useState<string[]>([])
  const [selPos,     setSelPos]     = useState<string[]>([])
  const [teamInput,  setTeamInput]  = useState('')
  const [posInput,   setPosInput]   = useState('')

  useEffect(() => {
    api.get('/users/teams').then((r) => setTeams(r.data.data ?? []))
    api.get('/users/positions').then((r) => setPositions(r.data.data ?? []))
  }, [])

  useEffect(() => {
    if (trail) {
      reset({ title: trail.title, description: trail.description, status: trail.status, minScoreToAdvance: trail.minScoreToAdvance })
      setSelTeams(trail.assignedTo?.teams ?? [])
      setSelPos(trail.assignedTo?.positions ?? [])
    } else {
      reset({ title: '', description: '', status: 'draft', minScoreToAdvance: 70 })
      setSelTeams([]); setSelPos([])
    }
  }, [trail, reset])

  const w = watch()

  const handleFormSubmit = (data: FormData) => {
    onSubmit({ ...data, assignedTo: { userIds: [], teams: selTeams, positions: selPos } })
  }

  const addTag = (val: string, list: string[], setList: (v: string[]) => void, setInput: (v: string) => void) => {
    if (val && !list.includes(val)) setList([...list, val])
    setInput('')
  }

  return (
    <Drawer
      open={open} onClose={onClose}
      title={isEdit ? 'Editar trilha' : 'Nova trilha'}
      subtitle={isEdit ? `Editando: ${trail?.title}` : 'Configure a trilha de aprendizado'}
      footer={
        <>
          <Button variant="secondary" size="medium" onClick={onClose} disabled={saving}>Cancelar</Button>
          <Button variant="primary"   size="medium" loading={saving}  onClick={handleSubmit(handleFormSubmit)}>
            {isEdit ? 'Salvar alterações' : 'Criar trilha'}
          </Button>
        </>
      }
    >
      <form className="flex flex-col gap-5" noValidate>
        <TextField label="Título" placeholder="Ex: Onboarding Geral" value={w.title}
          onChange={(v) => setValue('title', v)} error={errors.title?.message} required />

        <div className="flex flex-col gap-1">
          <label className="text-[12px] font-bold text-[var(--color-text-primary)]">Descrição <span className="text-[var(--color-text-danger)]">*</span></label>
          <textarea
            value={w.description}
            onChange={(e) => setValue('description', e.target.value)}
            placeholder="Descreva o objetivo desta trilha…"
            rows={3}
            className={[
              'w-full px-[14px] py-[10px] rounded-[var(--radius-sm)]',
              'border-[1.5px] outline-none resize-none',
              'font-[var(--font-family-base)] text-[12px] text-[var(--color-text-primary)]',
              'placeholder:text-[var(--color-text-disabled)]',
              'transition-[border-color,background-color] duration-[150ms]',
              w.description
                ? 'bg-[var(--color-surface-default)] border-[var(--color-border-default)]'
                : 'bg-[var(--color-surface-muted)] border-transparent',
              'focus:bg-[var(--color-surface-default)] focus:border-[var(--color-border-focus)]',
              errors.description ? 'border-[var(--color-border-error)]' : '',
            ].join(' ')}
          />
          {errors.description && <span className="text-[10px] text-[var(--color-text-danger)] pl-1">{errors.description.message}</span>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select label="Status" value={w.status}
            onChange={(v) => setValue('status', v as any)}
            options={[{ value: 'draft', label: 'Rascunho' }, { value: 'published', label: 'Publicado' }]} />
          <TextField label="Nota mínima (%)" type="number" placeholder="70"
            value={String(w.minScoreToAdvance)}
            onChange={(v) => setValue('minScoreToAdvance', Number(v))}
            error={errors.minScoreToAdvance?.message} helper="Para avançar ao próximo item" />
        </div>

        {/* Atribuição por time */}
        <div className="flex flex-col gap-2">
          <label className="text-[12px] font-bold text-[var(--color-text-primary)]">Atribuir por time</label>
          <div className="flex gap-2">
            <Select placeholder="Selecionar time" value={teamInput} onChange={setTeamInput}
              options={teams.map((t) => ({ value: t, label: t }))} />
            <Button variant="secondary" size="small" iconLeft={<Plus size={14} />}
              onClick={() => addTag(teamInput, selTeams, setSelTeams, setTeamInput)} type="button">
              Adicionar
            </Button>
          </div>
          {selTeams.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-1">
              {selTeams.map((t) => (
                <Tag key={t} theme="blue" size="small" onRemove={() => setSelTeams(selTeams.filter((x) => x !== t))}>{t}</Tag>
              ))}
            </div>
          )}
        </div>

        {/* Atribuição por cargo */}
        <div className="flex flex-col gap-2">
          <label className="text-[12px] font-bold text-[var(--color-text-primary)]">Atribuir por cargo</label>
          <div className="flex gap-2">
            <Select placeholder="Selecionar cargo" value={posInput} onChange={setPosInput}
              options={positions.map((p) => ({ value: p, label: p }))} />
            <Button variant="secondary" size="small" iconLeft={<Plus size={14} />}
              onClick={() => addTag(posInput, selPos, setSelPos, setPosInput)} type="button">
              Adicionar
            </Button>
          </div>
          {selPos.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-1">
              {selPos.map((p) => (
                <Tag key={p} theme="green" size="small" onRemove={() => setSelPos(selPos.filter((x) => x !== p))}>{p}</Tag>
              ))}
            </div>
          )}
        </div>
      </form>
    </Drawer>
  )
}
