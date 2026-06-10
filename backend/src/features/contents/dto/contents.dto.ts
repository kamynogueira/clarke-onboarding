import { z } from 'zod'

const BaseContentSchema = z.object({
  title: z.string().min(2, 'Título deve ter ao menos 2 caracteres'),
  description: z.string().min(5, 'Descrição deve ter ao menos 5 caracteres'),
})

export const CreateContentSchema = z
  .discriminatedUnion('type', [
    BaseContentSchema.extend({
      type: z.literal('pdf'),
      url: z.string().url('URL do PDF inválida'),
    }),
    BaseContentSchema.extend({
      type: z.literal('video'),
      youtubeId: z.string().min(1, 'ID do YouTube obrigatório'),
    }),
    BaseContentSchema.extend({
      type: z.literal('gdoc'),
      url: z.string().url('URL do Google Drive inválida'),
    }),
    BaseContentSchema.extend({
      type: z.literal('quiz'),
      quizId: z.string().min(1, 'quizId obrigatório'),
    }),
  ])

export const UpdateContentSchema = z.object({
  title: z.string().min(2).optional(),
  description: z.string().min(5).optional(),
  url: z.string().url().optional(),
  youtubeId: z.string().optional(),
  quizId: z.string().optional(),
})

export const ListContentsSchema = z.object({
  type: z.enum(['pdf', 'video', 'gdoc', 'quiz']).optional(),
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0),
})

export const ListLibraryContentsSchema = z.object({
  type: z.enum(['pdf', 'video', 'gdoc']).optional(),
  search: z.string().optional(),
  sort: z.enum(['newest', 'oldest', 'az', 'za']).default('newest'),
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0),
})

export type CreateContentDto = z.infer<typeof CreateContentSchema>
export type UpdateContentDto = z.infer<typeof UpdateContentSchema>
export type ListContentsDto = z.infer<typeof ListContentsSchema>
export type ListLibraryContentsDto = z.infer<typeof ListLibraryContentsSchema>
