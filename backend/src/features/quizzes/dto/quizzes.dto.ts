import { z } from 'zod'

const OptionSchema = z.object({
  id: z.string().optional(),
  text: z.string().min(1, 'Texto da opção obrigatório'),
  isCorrect: z.boolean(),
})

const QuestionSchema = z.object({
  id: z.string().optional(),
  text: z.string().min(5, 'Texto da questão deve ter ao menos 5 caracteres'),
  options: z
    .array(OptionSchema)
    .min(2, 'Questão deve ter ao menos 2 opções')
    .refine(
      (opts) => opts.filter((o) => o.isCorrect).length === 1,
      { message: 'Questão deve ter exatamente 1 opção correta' },
    ),
})

export const CreateQuizSchema = z.object({
  title: z.string().min(2, 'Título deve ter ao menos 2 caracteres'),
  passingScore: z
    .number()
    .min(0)
    .max(100)
    .default(70)
    .describe('Percentual mínimo para aprovação'),
  questions: z.array(QuestionSchema).min(1, 'Prova deve ter ao menos 1 questão'),
})

export const UpdateQuizSchema = z.object({
  title: z.string().min(2).optional(),
  passingScore: z.number().min(0).max(100).optional(),
  questions: z.array(QuestionSchema).min(1).optional(),
})

export const SubmitQuizSchema = z.object({
  trailId: z.string().min(1, 'trailId obrigatório'),
  itemId: z.string().min(1, 'itemId obrigatório'),
  answers: z
    .array(
      z.object({
        questionId: z.string().min(1),
        selectedOptionId: z.string().min(1),
      }),
    )
    .min(1, 'Respostas obrigatórias'),
})

export const ListQuizzesSchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0),
})

export type CreateQuizDto = z.infer<typeof CreateQuizSchema>
export type UpdateQuizDto = z.infer<typeof UpdateQuizSchema>
export type SubmitQuizDto = z.infer<typeof SubmitQuizSchema>
export type ListQuizzesDto = z.infer<typeof ListQuizzesSchema>
