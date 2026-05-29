import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'
import { AuthUser } from '@/services/auth.service'

interface AuthContextValue {
  user: AuthUser | null
  loading: boolean
  setUser: (user: AuthUser | null) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  // TODO: remove mock user and restore Firebase auth when login is ready
  const [user, setUser] = useState<AuthUser | null>({
    uid: 'test-user',
    email: 'test@clarke.com.br',
    name: 'Test Admin',
    role: 'admin',
    team: '',
    position: '',
  })
  const [loading] = useState(false)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  useEffect(() => {}, [])

  return (
    <AuthContext.Provider value={{ user, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return ctx
}
