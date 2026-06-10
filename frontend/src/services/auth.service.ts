import { signInWithCustomToken, signOut as firebaseSignOut } from 'firebase/auth'
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

export async function requestLogin(email: string, password: string): Promise<AuthUser> {
  const { data } = await api.post('/auth/login', { email, password })
  const { customToken } = data.data

  const credential = await signInWithCustomToken(auth, customToken)
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

export async function verify2FA(uid: string, code: string): Promise<AuthUser> {
  const { data } = await api.post('/auth/2fa/verify', { uid, code })
  const { customToken } = data.data

  const credential = await signInWithCustomToken(auth, customToken)
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

export async function resend2FA(uid: string): Promise<void> {
  await api.post('/auth/2fa/resend', { uid })
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
