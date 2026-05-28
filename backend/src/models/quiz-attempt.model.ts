import { Injectable } from '@nestjs/common'
import { FirebaseService } from '@core/firebase/firebase.service'

export interface QuizAnswer {
  questionId: string
  selectedOptionId: string
}

export interface QuizAttempt {
  id: string
  userId: string
  quizId: string
  trailId: string
  itemId: string
  answers: QuizAnswer[]
  score: number
  passed: boolean
  attemptedAt: Date
}

export type CreateAttemptInput = Omit<QuizAttempt, 'id'>

@Injectable()
export class QuizAttemptModel {
  private readonly collection = 'quizAttempts'

  constructor(private readonly firebase: FirebaseService) {}

  async create(input: CreateAttemptInput): Promise<QuizAttempt> {
    const ref = this.firebase.db.collection(this.collection).doc()
    await ref.set(input)
    return { id: ref.id, ...input }
  }

  async findByUserAndQuiz(userId: string, quizId: string): Promise<QuizAttempt[]> {
    const snap = await this.firebase.db
      .collection(this.collection)
      .where('userId', '==', userId)
      .where('quizId', '==', quizId)
      .orderBy('attemptedAt', 'desc')
      .get()
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as QuizAttempt)
  }

  async findByUserAndTrail(userId: string, trailId: string): Promise<QuizAttempt[]> {
    const snap = await this.firebase.db
      .collection(this.collection)
      .where('userId', '==', userId)
      .where('trailId', '==', trailId)
      .orderBy('attemptedAt', 'desc')
      .get()
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as QuizAttempt)
  }

  async findLastPassedAttempt(
    userId: string,
    quizId: string,
  ): Promise<QuizAttempt | null> {
    const snap = await this.firebase.db
      .collection(this.collection)
      .where('userId', '==', userId)
      .where('quizId', '==', quizId)
      .where('passed', '==', true)
      .orderBy('attemptedAt', 'desc')
      .limit(1)
      .get()

    if (snap.empty) return null
    const d = snap.docs[0]
    return { id: d.id, ...d.data() } as QuizAttempt
  }

  async findAllByTrail(trailId: string): Promise<QuizAttempt[]> {
    const snap = await this.firebase.db
      .collection(this.collection)
      .where('trailId', '==', trailId)
      .orderBy('attemptedAt', 'desc')
      .get()
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as QuizAttempt)
  }
}
