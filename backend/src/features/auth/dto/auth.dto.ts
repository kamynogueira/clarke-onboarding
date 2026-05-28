import { z } from 'zod'

export const LoginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
})

export const Verify2FASchema = z.object({
  uid: z.string().min(1, 'UID obrigatório'),
  code: z.string().length(6, 'Código deve ter 6 dígitos'),
})

export const RequestNew2FASchema = z.object({
  uid: z.string().min(1, 'UID obrigatório'),
})

export type LoginDto = z.infer<typeof LoginSchema>
export type Verify2FADto = z.infer<typeof Verify2FASchema>
export type RequestNew2FADto = z.infer<typeof RequestNew2FASchema>
