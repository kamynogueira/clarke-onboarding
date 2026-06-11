import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { TextField } from '@/components/ui/TextField'
import { useSnackbar } from '@/components/ui/Snackbar'
import { requestLogin } from '@/services/auth.service'

const schema = z.object({
  email:    z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
})
type FormData = z.infer<typeof schema>

export function LoginPage() {
  const navigate = useNavigate()
  const { show } = useSnackbar()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const { handleSubmit, watch, formState: { errors }, setValue } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  })

  const email    = watch('email')
  const password = watch('password')

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const { uid } = await requestLogin(data.email, data.password)
      navigate('/verify-2fa', { state: { uid, email: data.email } })
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'Credenciais inválidas'
      show({ message: msg, type: 'default' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-surface-subtle)] px-4">
      <div className="w-full max-w-[400px]">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-12 h-12 rounded-full bg-[var(--color-green-500)] flex items-center justify-center mb-4">
            <span className="text-[var(--color-text-on-brand)] font-extrabold text-[20px]">C</span>
          </div>
          <h1 className="text-[24px] font-bold text-[var(--color-text-primary)]">
            Clarke Onboarding
          </h1>
          <p className="text-[14px] text-[var(--color-text-secondary)] mt-1">
            Acesse sua conta para continuar
          </p>
        </div>

        {/* Card */}
        <div className="bg-[var(--color-surface-default)] rounded-[var(--radius-md)] p-8 shadow-[var(--shadow-elevation)]">
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
            <TextField
              label="E-mail"
              type="email"
              placeholder="seu@clarke.com.br"
              value={email}
              onChange={(v) => setValue('email', v)}
              error={errors.email?.message}
              icon={<Mail size={14} />}
              required
            />

            <TextField
              label="Senha"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(v) => setValue('password', v)}
              error={errors.password?.message}
              icon={
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="cursor-pointer bg-transparent border-none p-0 flex items-center"
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              }
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="medium"
              long
              loading={loading}
              className="mt-2"
            >
              Entrar
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-[var(--color-border-subtle)] text-center">
            <p className="text-[13px] text-[var(--color-text-secondary)]">
              Ainda não tem conta?{' '}
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="text-[var(--color-green-500)] font-bold hover:underline bg-transparent border-none cursor-pointer p-0"
              >
                Criar conta
              </button>
            </p>
          </div>
        </div>

        <p className="text-center text-[12px] text-[var(--color-text-tertiary)] mt-6">
          Plataforma interna Clarke Energia © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  )
}
