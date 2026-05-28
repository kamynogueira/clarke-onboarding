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

export async function requestLogin(email: string, password: string): Promise<{ uid: string }> {
  const { data } = await api.post('/auth/login', { email, password })
  return data.data
}

export async function verify2FA(uid: string, code: string): Promise<AuthUser> {
  const { data } = await api.post('/auth/2fa/verify', { uid, code })
  const { customToken } = data.data

  const credential = await signInWithCustomToken(auth, customToken)
  const tokenResult = await credential.user.getIdTokenResult(true)

  return {
    uid: credential.user.uid,
    email: credential.user.email ?? '',
    name: credential.user.displayName ?? '',
    role: tokenResult.claims.role as 'admin' | 'collaborator',
    team: tokenResult.claims.team as string ?? '',
    position: tokenResult.claims.position as string ?? '',
  }
}

export async function resend2FA(uid: string): Promise<void> {
  await api.post('/auth/2fa/resend', { uid })
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth)
}
