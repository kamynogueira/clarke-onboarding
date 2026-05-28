import { Injectable, NotFoundException } from '@nestjs/common'
import { FirebaseService } from '@core/firebase/firebase.service'

export type TrailStatus = 'draft' | 'published'
export type ContentType = 'pdf' | 'video' | 'quiz' | 'gdoc'

export interface TrailAssignment {
  userIds: string[]
  teams: string[]
  positions: string[]
}

export interface Trail {
  id: string
  title: string
  description: string
  thumbnail?: string
  status: TrailStatus
  minScoreToAdvance: number
  assignedTo: TrailAssignment
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export interface TrailItem {
  id: string
  trailId: string
  order: number
  contentId: string
  type: ContentType
}

export type CreateTrailInput = Omit<Trail, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateTrailInput = Partial<Omit<Trail, 'id' | 'createdAt'>>
export type CreateTrailItemInput = Omit<TrailItem, 'id' | 'trailId'>

@Injectable()
export class TrailModel {
  private readonly collection = 'trails'

  constructor(private readonly firebase: FirebaseService) {}

  async findById(id: string): Promise<Trail> {
    const doc = await this.firebase.db.collection(this.collection).doc(id).get()
    if (!doc.exists) throw new NotFoundException(`Trilha ${id} não encontrada`)
    return { id: doc.id, ...doc.data() } as Trail
  }

  async findAll(filters?: {
    status?: TrailStatus
    limit?: number
    offset?: number
  }): Promise<{ data: Trail[]; total: number }> {
    let query = this.firebase.db
      .collection(this.collection)
      .orderBy('createdAt', 'desc') as FirebaseFirestore.Query

    if (filters?.status) query = query.where('status', '==', filters.status)

    const total = (await query.count().get()).data().count
    if (filters?.offset) query = query.offset(filters.offset)
    if (filters?.limit) query = query.limit(filters.limit)

    const snap = await query.get()
    const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Trail)
    return { data, total }
  }

  async findAssignedToUser(userId: string, team: string, position: string): Promise<Trail[]> {
    const snap = await this.firebase.db
      .collection(this.collection)
      .where('status', '==', 'published')
      .get()

    return snap.docs
      .map((d) => ({ id: d.id, ...d.data() }) as Trail)
      .filter((trail) => {
        const { userIds, teams, positions } = trail.assignedTo
        return (
          userIds.includes(userId) ||
          teams.includes(team) ||
          positions.includes(position)
        )
      })
  }

  async create(input: CreateTrailInput): Promise<Trail> {
    const now = new Date()
    const ref = this.firebase.db.collection(this.collection).doc()
    const trail: Omit<Trail, 'id'> = { ...input, createdAt: now, updatedAt: now }
    await ref.set(trail)
    return { id: ref.id, ...trail }
  }

  async update(id: string, input: UpdateTrailInput): Promise<Trail> {
    await this.findById(id)
    await this.firebase.db
      .collection(this.collection)
      .doc(id)
      .update({ ...input, updatedAt: new Date() })
    return this.findById(id)
  }

  async delete(id: string): Promise<void> {
    await this.findById(id)
    const batch = this.firebase.db.batch()
    const itemsSnap = await this.firebase.db
      .collection(this.collection)
      .doc(id)
      .collection('items')
      .get()
    itemsSnap.docs.forEach((d) => batch.delete(d.ref))
    batch.delete(this.firebase.db.collection(this.collection).doc(id))
    await batch.commit()
  }

  async getItems(trailId: string): Promise<TrailItem[]> {
    const snap = await this.firebase.db
      .collection(this.collection)
      .doc(trailId)
      .collection('items')
      .orderBy('order', 'asc')
      .get()
    return snap.docs.map((d) => ({ id: d.id, trailId, ...d.data() }) as TrailItem)
  }

  async addItem(trailId: string, input: CreateTrailItemInput): Promise<TrailItem> {
    await this.findById(trailId)
    const ref = this.firebase.db
      .collection(this.collection)
      .doc(trailId)
      .collection('items')
      .doc()
    await ref.set(input)
    return { id: ref.id, trailId, ...input }
  }

  async updateItemOrder(trailId: string, itemId: string, order: number): Promise<void> {
    await this.firebase.db
      .collection(this.collection)
      .doc(trailId)
      .collection('items')
      .doc(itemId)
      .update({ order })
  }

  async removeItem(trailId: string, itemId: string): Promise<void> {
    await this.firebase.db
      .collection(this.collection)
      .doc(trailId)
      .collection('items')
      .doc(itemId)
      .delete()
  }
}
