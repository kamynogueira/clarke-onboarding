import { Injectable } from '@nestjs/common'
import { QuizModel, Quiz } from '@models/quiz.model'
import { QuizAttemptModel, QuizAttempt } from '@models/quiz-attempt.model'
import { ProgressModel } from '@models/progress.model'
import { TrailModel } from '@models/trail.model'
import {
  CreateQuizDto,
  UpdateQuizDto,
  SubmitQuizDto,
  ListQuizzesDto,
} from './dto/quizzes.dto'

export interface SubmitResult {
  attempt: QuizAttempt
  score: number
  passed: boolean
  correctCount: number
  totalQuestions: number
  unlockedNextItem: boolean
}

@Injectable()
export class QuizzesService {
  constructor(
    private readonly quizModel: QuizModel,
    private readonly attemptModel: QuizAttemptModel,
    private readonly progressModel: ProgressModel,
    private readonly trailModel: TrailModel,
  ) {}

  async findAll(
    filters: ListQuizzesDto,
  ): Promise<{ data: Quiz[]; total: number; limit: number; offset: number }> {
    const { data, total } = await this.quizModel.findAll(filters)
    return { data, total, limit: filters.limit, offset: filters.offset }
  }

  async findById(id: string): Promise<Quiz> {
    return this.quizModel.findById(id)
  }

  async create(dto: CreateQuizDto, createdBy: string): Promise<Quiz> {
    return this.quizModel.create({ ...dto, createdBy })
  }

  async update(id: string, dto: UpdateQuizDto): Promise<Quiz> {
    return this.quizModel.update(id, dto)
  }

  async delete(id: string): Promise<void> {
    return this.quizModel.delete(id)
  }

  async submit(
    quizId: string,
    userId: string,
    dto: SubmitQuizDto,
  ): Promise<SubmitResult> {
    const quiz = await this.quizModel.findById(quizId)
    const trail = await this.trailModel.findById(dto.trailId)

    const { score, correctCount } = this.grade(quiz, dto.answers)
    const passed = score >= quiz.passingScore

    const attempt = await this.attemptModel.create({
      userId,
      quizId,
      trailId: dto.trailId,
      itemId: dto.itemId,
      answers: dto.answers,
      score,
      passed,
      attemptedAt: new Date(),
    })

    let unlockedNextItem = false

    if (passed) {
      await this.progressModel.completeItem(userId, dto.trailId, dto.itemId)

      const items = await this.trailModel.getItems(dto.trailId)
      const currentItem = items.find((i) => i.id === dto.itemId)
      const nextItem = items.find(
        (i) => i.order === (currentItem?.order ?? -1) + 1,
      )

      if (nextItem) {
        await this.progressModel.updateCurrentItem(
          userId,
          dto.trailId,
          nextItem.order,
        )
        unlockedNextItem = true
      } else {
        const trailScore = this.calculateOverallTrailScore(score, trail.minScoreToAdvance)
        if (trailScore >= trail.minScoreToAdvance) {
          await this.progressModel.completeTrail(userId, dto.trailId)
        }
      }
    }

    return {
      attempt,
      score,
      passed,
      correctCount,
      totalQuestions: quiz.questions.length,
      unlockedNextItem,
    }
  }

  async getAttemptsByUser(userId: string, quizId: string): Promise<QuizAttempt[]> {
    return this.attemptModel.findByUserAndQuiz(userId, quizId)
  }

  private grade(
    quiz: Quiz,
    answers: { questionId: string; selectedOptionId: string }[],
  ): { score: number; correctCount: number } {
    let correctCount = 0

    for (const answer of answers) {
      const question = quiz.questions.find((q) => q.id === answer.questionId)
      if (!question) continue

      const correctOption = question.options.find((o) => o.isCorrect)
      if (correctOption?.id === answer.selectedOptionId) {
        correctCount++
      }
    }

    const score =
      quiz.questions.length > 0
        ? Math.round((correctCount / quiz.questions.length) * 100)
        : 0

    return { score, correctCount }
  }

  private calculateOverallTrailScore(quizScore: number, minScore: number): number {
    return quizScore
  }
}
