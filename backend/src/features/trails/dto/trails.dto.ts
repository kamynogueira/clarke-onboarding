import { z } from 'zod'

const AssignmentSchema = z.object({
  userIds: z.array(z.string()).default([]),
  teams: z.array(z.string()).default([]),
  positions: z.array(z.string()).default([]),
})

export const CreateTrailSchema = z.object({
  title: z.string().min(2, 'Título deve ter ao menos 2 caracteres'),
  description: z.string().min(10, 'Descrição deve ter ao menos 10 caracteres'),
  thumbnail: z.string().url('URL inválida').optional(),
  status: z.enum(['draft', 'published']).default('draft'),
  minScoreToAdvance: z
    .number()
    .min(0)
    .max(100)
    .default(70)
    .describe('Nota mínima (0-100) para avançar ao próximo item'),
  assignedTo: AssignmentSchema.default({ userIds: [], teams: [], positions: [] }),
})

export const UpdateTrailSchema = CreateTrailSchema.partial()

export const AddTrailItemSchema = z.object({
  contentId: z.string().min(1, 'contentId obrigatório'),
  type: z.enum(['pdf', 'video', 'quiz', 'gdoc']),
  order: z.number().int().min(0),
})

export const ReorderTrailItemsSchema = z.object({
  items: z.array(
    z.object({
      itemId: z.string(),
      order: z.number().int().min(0),
    }),
  ),
})

export const ListTrailsSchema = z.object({
  status: z.enum(['draft', 'published']).optional(),
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0),
})

export type CreateTrailDto = z.infer<typeof CreateTrailSchema>
export type UpdateTrailDto = z.infer<typeof UpdateTrailSchema>
export type AddTrailItemDto = z.infer<typeof AddTrailItemSchema>
export type ReorderTrailItemsDto = z.infer<typeof ReorderTrailItemsSchema>
export type ListTrailsDto = z.infer<typeof ListTrailsSchema>
