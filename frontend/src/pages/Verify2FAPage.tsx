import { useState, useRef, KeyboardEvent, ClipboardEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ShieldCheck, RotateCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useSnackbar } from '@/components/ui/Snackbar'
import { useAuth } from '@/contexts/AuthContext'
import { verify2FA, resend2FA } from '@/services/auth.service'

export function Verify2FAPage() {
  const navigate   = useNavigate()
  const location   = useLocation()
  const { setUser } = useAuth()
  const { show }   = useSnackbar()

  const { uid, email } = (location.state as { uid: string; email: string }) ?? {}

  const [digits, setDigits] = useState<string[]>(Array(6).fill(''))
  const [loading, setLoading]   = useState(false)
  const [resending, setResending] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  if (!uid || !email) {
    navigate('/login', { replace: true })
    return null
  }

  const updateDigit = (index: number, value: string) => {
    const clean = value.replace(/\D/g, '').slice(-1)
    const next  = [...digits]
    next[index] = clean
    setDigits(next)
    if (clean && index < 5) inputRefs.current[index + 1]?.focus()
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === 'ArrowLeft' && index > 0) inputRefs.current[index - 1]?.focus()
    if (e.key === 'ArrowRight' && index < 5) inputRefs.current[index + 1]?.focus()
  }

  const handlePaste = (e: ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    const next   = [...digits]
    pasted.split('').forEach((d, i) => { next[i] = d })
    setDigits(next)
    inputRefs.current[Math.min(pasted.length, 5)]?.focus()
  }

  const handleSubmit = async () => {
    const code = digits.join('')
    if (code.length < 6) {
      show({ message: 'Digite os 6 dígitos do código' })
      return
    }
    setLoading(true)
    try {
      const user = await verify2FA(uid, code)
      setUser(user)
      navigate(user.role === 'admin' ? '/admin' : '/onboarding', { replace: true })
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'Código inválido ou expirado'
      show({ message: msg })
      setDigits(Array(6).fill(''))
      inputRefs.current[0]?.focus()
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setResending(true)
    try {
      await resend2FA(uid)
      show({ message: 'Novo código enviado para o seu e-mail' })
      setDigits(Array(6).fill(''))
      inputRefs.current[0]?.focus()
    } catch {
      show({ message: 'Não foi possível reenviar o código' })
    } finally {
      setResending(false)
    }
  }

  const isComplete = digits.every((d) => d !== '')

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-surface-subtle)] px-4">
      <div className="w-full max-w-[400px]">
        <div className="bg-[var(--color-surface-default)] rounded-[var(--radius-md)] p-8 shadow-[var(--shadow-elevation)] flex flex-col items-center gap-6">

          <div className="w-14 h-14 rounded-full border-2 border-[var(--color-green-500)] flex items-center justify-center text-[var(--color-green-500)]">
            <ShieldCheck size={28} />
          </div>

          <div className="text-center">
            <h1 className="text-[20px] font-bold text-[var(--color-text-primary)]">
              Verificação em duas etapas
            </h1>
            <p className="text-[12px] text-[var(--color-text-secondary)] mt-2 leading-relaxed">
              Enviamos um código de 6 dígitos para<br />
              <span className="font-bold text-[var(--color-text-primary)]">{email}</span>
            </p>
          </div>

          {/* Inputs de dígitos */}
          <div className="flex gap-2" onPaste={handlePaste}>
            {digits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => updateDigit(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                aria-label={`Dígito ${i + 1} do código`}
                className={[
                  'w-11 h-14 text-center text-[20px] font-bold rounded-[var(--radius-sm)]',
                  'border-[1.5px] outline-none',
                  'font-[var(--font-family-base)]',
                  'transition-[border-color,background-color] duration-[150ms]',
                  digit
                    ? 'bg-[var(--color-surface-default)] border-[var(--color-border-focus)] text-[var(--color-text-primary)]'
                    : 'bg-[var(--color-surface-muted)] border-transparent text-[var(--color-text-primary)]',
                  'focus:bg-[var(--color-surface-default)] focus:border-[var(--color-border-focus)]',
                ].join(' ')}
              />
            ))}
          </div>

          <Button
            variant="primary"
            size="medium"
            long
            loading={loading}
            disabled={!isComplete}
            onClick={handleSubmit}
          >
            Verificar código
          </Button>

          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className={[
              'inline-flex items-center gap-1 bg-transparent border-none cursor-pointer',
              'text-[12px] text-[var(--color-text-link)] font-[var(--font-family-base)]',
              'hover:underline disabled:opacity-50 disabled:cursor-not-allowed',
            ].join(' ')}
          >
            <RotateCw size={12} className={resending ? 'animate-spin' : ''} />
            Reenviar código
          </button>
        </div>
      </div>
    </div>
  )
}
