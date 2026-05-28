import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

interface ProtectedRouteProps {
  allowedRoles?: ('admin' | 'collaborator')[]
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--color-surface-subtle)]">
        <div className="w-8 h-8 rounded-full border-2 border-[var(--color-green-500)] border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/onboarding'} replace />
  }

  return <Outlet />
}
