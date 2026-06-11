import { z } from 'zod'

export const LoginSchema = z.object({
  idToken: z.string().min(1, 'Token obrigatório'),
})

export const RegisterSchema = z.object({
  name:     z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
  email:    z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
  phone:    z.string().min(10, 'Telefone inválido'),
})

export const ChangePasswordSchema = z.object({
  newPassword: z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
})

export type LoginDto = z.infer<typeof LoginSchema>
export type RegisterDto       = z.infer<typeof RegisterSchema>
export type ChangePasswordDto = z.infer<typeof ChangePasswordSchema>
