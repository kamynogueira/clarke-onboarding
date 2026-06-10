import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { BookOpen, Library, LogOut } from 'lucide-react'
import clsx from 'clsx'
import { useAuth } from '@/contexts/AuthContext'
import { signOut } from '@/services/auth.service'
import { useSnackbar } from '@/components/ui/Snackbar'

const navItems = [
  { to: '/onboarding',         icon: BookOpen, label: 'Trilhas',    end: true },
  { to: '/onboarding/library', icon: Library,  label: 'Biblioteca'            },
]

export function CollaboratorLayout() {
  const { user, setUser } = useAuth()
  const navigate = useNavigate()
  const { show }  = useSnackbar()

  const handleSignOut = async () => {
    await signOut()
    setUser(null)
    navigate('/login', { replace: true })
    show({ message: 'Sessão encerrada com sucesso' })
  }

  return (
    <div className="flex min-h-screen bg-[var(--color-surface-subtle)]">
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 bg-[var(--color-surface-default)] border-r border-[var(--color-border-subtle)] flex flex-col shadow-[var(--shadow-elevation)] z-[var(--z-sticky)]">
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-6 border-b border-[var(--color-border-subtle)]">
          <div className="w-8 h-8 rounded-full bg-[var(--color-green-500)] flex items-center justify-center flex-shrink-0">
            <span className="text-[var(--color-text-on-brand)] font-extrabold text-[14px]">C</span>
          </div>
          <div>
            <p className="text-[14px] font-bold text-[var(--color-text-primary)] leading-tight">Clarke</p>
            <p className="text-[10px] text-[var(--color-text-tertiary)] leading-tight">Onboarding</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1" aria-label="Menu principal">
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-sm)]',
                  'text-[14px] font-[var(--font-family-base)] transition-colors duration-[150ms]',
                  isActive
                    ? 'bg-[var(--color-green-100)] text-[var(--color-green-500)] font-bold'
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text-primary)]',
                )
              }
            >
              <Icon size={18} className="flex-shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User + logout */}
        <div className="px-3 pb-4 flex flex-col gap-1 border-t border-[var(--color-border-subtle)] pt-4">
          <button
            onClick={() => navigate('/profile')}
            className={clsx(
              'flex flex-col items-start px-3 py-2 rounded-[var(--radius-sm)] w-full text-left',
              'hover:bg-[var(--color-surface-muted)] transition-colors duration-[150ms] cursor-pointer border-none bg-transparent',
            )}
          >
            <p className="text-[12px] font-bold text-[var(--color-text-primary)] truncate w-full">{user?.name}</p>
            <p className="text-[10px] text-[var(--color-text-tertiary)] truncate w-full">{user?.email}</p>
          </button>
          <button
            onClick={handleSignOut}
            className={clsx(
              'flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-sm)] w-full',
              'text-[14px] text-[var(--color-text-secondary)] font-[var(--font-family-base)]',
              'hover:bg-[var(--color-feedback-error-bg)] hover:text-[var(--color-text-danger)]',
              'transition-colors duration-[150ms] cursor-pointer border-none bg-transparent',
            )}
          >
            <LogOut size={18} className="flex-shrink-0" />
            Sair
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
