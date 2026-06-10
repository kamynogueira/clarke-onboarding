import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { TextField } from '@/components/ui/TextField'
import { useSnackbar } from '@/components/ui/Snackbar'
import { register } from '@/services/auth.service'

const schema = z.object({
  name:     z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
  email:    z.string().email('E-mail inválido'),
  phone:    z.string().min(10, 'Telefone inválido'),
  password: z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
})
type FormData = z.infer<typeof schema>

export function RegisterPage() {
  const navigate = useNavigate()
  const { show } = useSnackbar()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading]     = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const { handleSubmit, watch, formState: { errors }, setValue } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', phone: '', password: '' },
  })

  const values = watch()

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      await register(data)
      setSubmitted(true)
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'Erro ao criar conta. Tente novamente.'
      show({ message: msg })
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
            Crie sua conta para começar
          </p>
        </div>

        <div className="bg-[var(--color-surface-default)] rounded-[var(--radius-md)] p-8 shadow-[var(--shadow-elevation)]">
          {submitted ? (
            <div className="flex flex-col items-center text-center gap-4 py-4">
              <CheckCircle2 size={48} className="text-[var(--color-green-500)]" />
              <div>
                <p className="text-[18px] font-bold text-[var(--color-text-primary)]">
                  Cadastro enviado!
                </p>
                <p className="text-[14px] text-[var(--color-text-secondary)] mt-2">
                  Seu cadastro está sendo analisado. Você receberá uma resposta por e-mail em breve.
                </p>
              </div>
              <Button variant="secondary" size="medium" onClick={() => navigate('/login')}>
                Voltar ao login
              </Button>
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
                <TextField
                  label="Nome completo"
                  placeholder="João Silva"
                  value={values.name}
                  onChange={(v) => setValue('name', v)}
                  error={errors.name?.message}
                  required
                />

                <TextField
                  label="E-mail"
                  type="email"
                  placeholder="seu@email.com"
                  value={values.email}
                  onChange={(v) => setValue('email', v)}
                  error={errors.email?.message}
                  required
                />

                <TextField
                  label="Telefone"
                  placeholder="(11) 98888-7777"
                  value={values.phone}
                  onChange={(v) => setValue('phone', v)}
                  error={errors.phone?.message}
                  required
                />

                <TextField
                  label="Senha"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mínimo 6 caracteres"
                  value={values.password}
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

                <Button type="submit" variant="primary" size="medium" long loading={loading} className="mt-2">
                  Criar conta
                </Button>
              </form>

              <div className="mt-6 pt-5 border-t border-[var(--color-border-subtle)] text-center">
                <p className="text-[13px] text-[var(--color-text-secondary)]">
                  Já tem conta?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="text-[var(--color-green-500)] font-bold hover:underline bg-transparent border-none cursor-pointer p-0"
                  >
                    Fazer login
                  </button>
                </p>
              </div>
            </>
          )}
        </div>

        <p className="text-center text-[12px] text-[var(--color-text-tertiary)] mt-6">
          Plataforma interna Clarke Energia © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  )
}
