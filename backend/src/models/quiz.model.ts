import { Injectable, NotFoundException } from '@nestjs/common'
import { FirebaseService } from '@core/firebase/firebase.service'

export interface QuizOption {
  id: string
  text: string
  isCorrect: boolean
}

export interface QuizQuestion {
  id: string
  text: string
  options: QuizOption[]
}

export interface Quiz {
  id: string
  title: string
  passingScore: number
  questions: QuizQuestion[]
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

interface QuizOptionInput {
  id?: string
  text: string
  isCorrect: boolean
}

interface QuizQuestionInput {
  id?: string
  text: string
  options: QuizOptionInput[]
}

export type CreateQuizInput = Omit<Quiz, 'id' | 'createdAt' | 'updatedAt' | 'questions'> & {
  questions: QuizQuestionInput[]
}
export type UpdateQuizInput = Partial<Omit<Quiz, 'id' | 'createdAt' | 'questions'>> & {
  questions?: QuizQuestionInput[]
}

@Injectable()
export class QuizModel {
  private readonly collection = 'quizzes'

  constructor(private readonly firebase: FirebaseService) {}

  async findById(id: string): Promise<Quiz> {
    const doc = await this.firebase.db.collection(this.collection).doc(id).get()
    if (!doc.exists) throw new NotFoundException(`Quiz ${id} não encontrado`)
    return { id: doc.id, ...doc.data() } as Quiz
  }

  async findAll(filters?: {
    limit?: number
    offset?: number
  }): Promise<{ data: Quiz[]; total: number }> {
    let query = this.firebase.db
      .collection(this.collection)
      .orderBy('createdAt', 'desc') as FirebaseFirestore.Query

    const total = (await query.count().get()).data().count
    if (filters?.offset) query = query.offset(filters.offset)
    if (filters?.limit) query = query.limit(filters.limit)

    const snap = await query.get()
    const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Quiz)
    return { data, total }
  }

  async create(input: CreateQuizInput): Promise<Quiz> {
    const now = new Date()
    const ref = this.firebase.db.collection(this.collection).doc()

    const questionsWithIds: QuizQuestion[] = input.questions.map((q) => ({
      ...q,
      id: q.id || ref.id + '_q_' + Math.random().toString(36).slice(2, 8),
      options: q.options.map((o) => ({
        ...o,
        id: o.id || Math.random().toString(36).slice(2, 8),
      })),
    }))

    const quiz: Omit<Quiz, 'id'> = {
      ...input,
      questions: questionsWithIds,
      createdAt: now,
      updatedAt: now,
    }
    await ref.set(quiz)
    return { id: ref.id, ...quiz }
  }

  async update(id: string, input: UpdateQuizInput): Promise<Quiz> {
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
