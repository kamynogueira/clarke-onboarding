import { Injectable, NotFoundException } from '@nestjs/common'
import { FirebaseService } from '@core/firebase/firebase.service'
import { FieldValue } from 'firebase-admin/firestore'

export type UserRole = 'admin' | 'collaborator'

export interface User {
  uid: string
  name: string
  email: string
  phone: string
  role: UserRole
  position: string
  team: string
  startDate: string
  twoFactorEnabled: boolean
  twoFactorCode?: string | null
  twoFactorCodeExpiresAt?: Date | null
  createdAt: Date
  updatedAt: Date
}

export type CreateUserInput = Omit<User, 'uid' | 'createdAt' | 'updatedAt'>
export type UpdateUserInput = Partial<Omit<User, 'uid' | 'createdAt'>>

@Injectable()
export class UserModel {
  private readonly collection = 'users'

  constructor(private readonly firebase: FirebaseService) {}

  async findById(uid: string): Promise<User> {
    const doc = await this.firebase.db
      .collection(this.collection)
      .doc(uid)
      .get()

    if (!doc.exists) throw new NotFoundException(`Usuário ${uid} não encontrado`)

    return { uid: doc.id, ...doc.data() } as User
  }

  async findByEmail(email: string): Promise<User | null> {
    const snap = await this.firebase.db
      .collection(this.collection)
      .where('email', '==', email)
      .limit(1)
      .get()

    if (snap.empty) return null
    const doc = snap.docs[0]
    return { uid: doc.id, ...doc.data() } as User
  }

  async findAll(filters?: {
    role?: UserRole
    team?: string
    position?: string
    limit?: number
    offset?: number
  }): Promise<{ data: User[]; total: number }> {
    let query = this.firebase.db
      .collection(this.collection)
      .orderBy('createdAt', 'desc') as FirebaseFirestore.Query

    if (filters?.role) query = query.where('role', '==', filters.role)
    if (filters?.team) query = query.where('team', '==', filters.team)
    if (filters?.position) query = query.where('position', '==', filters.position)

    const total = (await query.count().get()).data().count
    if (filters?.offset) query = query.offset(filters.offset)
    if (filters?.limit) query = query.limit(filters.limit)

    const snap = await query.get()
    const data = snap.docs.map((d) => ({ uid: d.id, ...d.data() }) as User)

    return { data, total }
  }

  async create(uid: string, input: CreateUserInput): Promise<User> {
    const now = new Date()
    const user: Omit<User, 'uid'> = {
      ...input,
      twoFactorEnabled: input.twoFactorEnabled ?? false,
      twoFactorCode: null,
      twoFactorCodeExpiresAt: null,
      createdAt: now,
      updatedAt: now,
    }

    await this.firebase.db.collection(this.collection).doc(uid).set(user)
    return { uid, ...user }
  }

  async update(uid: string, input: UpdateUserInput): Promise<User> {
    await this.findById(uid)
    await this.firebase.db
      .collection(this.collection)
      .doc(uid)
      .update({ ...input, updatedAt: new Date() })
    return this.findById(uid)
  }

  async delete(uid: string): Promise<void> {
    await this.findById(uid)
    await this.firebase.db.collection(this.collection).doc(uid).delete()
  }

  async set2FACode(
    uid: string,
    code: string,
    expiresAt: Date,
  ): Promise<void> {
    await this.firebase.db.collection(this.collection).doc(uid).update({
      twoFactorCode: code,
      twoFactorCodeExpiresAt: expiresAt,
      updatedAt: new Date(),
    })
  }

  async clear2FACode(uid: string): Promise<void> {
    await this.firebase.db.collection(this.collection).doc(uid).update({
      twoFactorCode: FieldValue.delete(),
      twoFactorCodeExpiresAt: FieldValue.delete(),
      updatedAt: new Date(),
    })
  }
}
