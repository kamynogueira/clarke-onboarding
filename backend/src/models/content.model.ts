import { Injectable, NotFoundException } from '@nestjs/common'
import { FirebaseService } from '@core/firebase/firebase.service'
import { ContentType } from './trail.model'

export interface Content {
  id: string
  title: string
  description: string
  type: ContentType
  url?: string
  youtubeId?: string
  quizId?: string
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export type CreateContentInput = Omit<Content, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateContentInput = Partial<Omit<Content, 'id' | 'createdAt'>>

@Injectable()
export class ContentModel {
  private readonly collection = 'contents'

  constructor(private readonly firebase: FirebaseService) {}

  async findById(id: string): Promise<Content> {
    const doc = await this.firebase.db.collection(this.collection).doc(id).get()
    if (!doc.exists) throw new NotFoundException(`Conteúdo ${id} não encontrado`)
    return { id: doc.id, ...doc.data() } as Content
  }

  async findAll(filters?: {
    type?: ContentType
    limit?: number
    offset?: number
  }): Promise<{ data: Content[]; total: number }> {
    let query = this.firebase.db
      .collection(this.collection)
      .orderBy('createdAt', 'desc') as FirebaseFirestore.Query

    if (filters?.type) query = query.where('type', '==', filters.type)

    const total = (await query.count().get()).data().count
    if (filters?.offset) query = query.offset(filters.offset)
    if (filters?.limit) query = query.limit(filters.limit)

    const snap = await query.get()
    const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Content)
    return { data, total }
  }

  async create(input: CreateContentInput): Promise<Content> {
    const now = new Date()
    const ref = this.firebase.db.collection(this.collection).doc()
    const content: Omit<Content, 'id'> = { ...input, createdAt: now, updatedAt: now }
    await ref.set(content)
    return { id: ref.id, ...content }
  }

  async update(id: string, input: UpdateContentInput): Promise<Content> {
    await this.findById(id)
    await this.firebase.db
      .collection(this.collection)
      .doc(id)
      .update({ ...input, updatedAt: new Date() })
    return this.findById(id)
  }

  async delete(id: string): Promise<void> {
    await this.findById(id)
    await this.firebase.db.collection(this.collection).doc(id).delete()
  }
}
