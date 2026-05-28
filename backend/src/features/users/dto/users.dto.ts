import { z } from 'zod'

export const CreateUserSchema = z.object({
  name: z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
  phone: z.string().min(10, 'Telefone inválido'),
  role: z.enum(['admin', 'collaborator']),
  position: z.string().min(1, 'Cargo obrigatório'),
  team: z.string().min(1, 'Time obrigatório'),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data no formato YYYY-MM-DD'),
  twoFactorEnabled: z.boolean().default(true),
})

export const UpdateUserSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().min(10).optional(),
  role: z.enum(['admin', 'collaborator']).optional(),
  position: z.string().min(1).optional(),
  team: z.string().min(1).optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  twoFactorEnabled: z.boolean().optional(),
})

export const ListUsersSchema = z.object({
  role: z.enum(['admin', 'collaborator']).optional(),
  team: z.string().optional(),
  position: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0),
})

export type CreateUserDto = z.infer<typeof CreateUserSchema>
export type UpdateUserDto = z.infer<typeof UpdateUserSchema>
export type ListUsersDto = z.infer<typeof ListUsersSchema>
