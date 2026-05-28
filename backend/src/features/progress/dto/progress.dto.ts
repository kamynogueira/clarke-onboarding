import { z } from 'zod'

export const StartTrailSchema = z.object({
  trailId: z.string().min(1, 'trailId obrigatório'),
})

export const CompleteItemSchema = z.object({
  trailId: z.string().min(1, 'trailId obrigatório'),
  itemId: z.string().min(1, 'itemId obrigatório'),
})

export type StartTrailDto = z.infer<typeof StartTrailSchema>
export type CompleteItemDto = z.infer<typeof CompleteItemSchema>
