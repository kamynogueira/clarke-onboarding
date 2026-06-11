import { signInWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth'
import { auth } from './firebase'
import { api } from './api'

export interface AuthUser {
  uid: string
  email: string
  name: string
  role: 'admin' | 'collaborator'
  team: string
  position: string
}

function firebaseErrorMessage(code: string): string {
  if (code === 'auth/user-disabled') return 'Seu cadastro ainda não foi aprovado ou foi rejeitado.'
  if (code === 'auth/too-many-requests') return 'Muitas tentativas de login. Tente novamente em alguns minutos.'
  return 'Credenciais inválidas'
}

export async function requestLogin(email: string, password: string): Promise<AuthUser> {
  let credential
  try {
    credential = await signInWithEmailAndPassword(auth, email, password)
  } catch (err: any) {
    const msg = firebaseErrorMessage(err.code)
    throw Object.assign(new Error(msg), { response: { data: { message: msg } } })
  }

  const idToken = await credential.user.getIdToken()

  try {
    await api.post('/auth/login', { idToken })
  } catch (apiError) {
    await firebaseSignOut(auth)
    throw apiError
  }

  const tokenResult = await credential.user.getIdTokenResult(true)

  return {
    uid:      credential.user.uid,
    email:    (tokenResult.claims.userEmail as string) || credential.user.email || '',
    name:     (tokenResult.claims.displayName as string) || credential.user.displayName || '',
    role:     tokenResult.claims.role as 'admin' | 'collaborator',
    team:     (tokenResult.claims.team as string) || '',
    position: (tokenResult.claims.position as string) || '',
  }
}

export async function register(data: {
  name: string
  email: string
  password: string
  phone: string
}): Promise<void> {
  await api.post('/auth/register', data)
}

export async function changePassword(newPassword: string): Promise<void> {
  await api.post('/auth/change-password', { newPassword })
}

export async function refreshCurrentUser(): Promise<AuthUser | null> {
  const currentUser = auth.currentUser
  if (!currentUser) return null
  const tokenResult = await currentUser.getIdTokenResult(true)
  return {
    uid:      currentUser.uid,
    email:    (tokenResult.claims.userEmail as string) || currentUser.email || '',
    name:     (tokenResult.claims.displayName as string) || currentUser.displayName || '',
    role:     tokenResult.claims.role as 'admin' | 'collaborator',
    team:     (tokenResult.claims.team as string) || '',
    position: (tokenResult.claims.position as string) || '',
  }
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth)
}
