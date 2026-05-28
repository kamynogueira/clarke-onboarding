import { Test, TestingModule } from '@nestjs/testing'
import { QuizzesService } from './quizzes.service'
import { QuizModel } from '@models/quiz.model'
import { QuizAttemptModel } from '@models/quiz-attempt.model'
import { ProgressModel } from '@models/progress.model'
import { TrailModel } from '@models/trail.model'

const mockQuiz = {
  id: 'quiz-001',
  title: 'Prova de Onboarding',
  passingScore: 70,
  createdBy: 'admin-uid',
  createdAt: new Date(),
  updatedAt: new Date(),
  questions: [
    {
      id: 'q1',
      text: 'O que é a Clarke Energia?',
      options: [
        { id: 'a', text: 'Errada', isCorrect: false },
        { id: 'b', text: 'Certa', isCorrect: true },
      ],
    },
    {
      id: 'q2',
      text: 'Qual é o CNPJ?',
      options: [
        { id: 'c', text: 'Errada', isCorrect: false },
        { id: 'd', text: 'Certa', isCorrect: true },
      ],
    },
    {
      id: 'q3',
      text: 'Quantos colaboradores?',
      options: [
        { id: 'e', text: 'Errada', isCorrect: false },
        { id: 'f', text: 'Certa', isCorrect: true },
      ],
    },
  ],
}

const mockTrail = {
  id: 'trail-001',
  minScoreToAdvance: 70,
  assignedTo: { userIds: [], teams: [], positions: [] },
}

const mockItems = [
  { id: 'item-1', trailId: 'trail-001', order: 0, contentId: 'c1', type: 'quiz' as const },
  { id: 'item-2', trailId: 'trail-001', order: 1, contentId: 'c2', type: 'pdf' as const },
]

const mockAttempt = { id: 'attempt-001', score: 100, passed: true }

const mockQuizModel = { findById: jest.fn().mockResolvedValue(mockQuiz), create: jest.fn(), update: jest.fn(), delete: jest.fn(), findAll: jest.fn() }
const mockAttemptModel = { create: jest.fn().mockResolvedValue(mockAttempt), findByUserAndQuiz: jest.fn() }
const mockProgressModel = { completeItem: jest.fn(), updateCurrentItem: jest.fn(), completeTrail: jest.fn() }
const mockTrailModel = { findById: jest.fn().mockResolvedValue(mockTrail), getItems: jest.fn().mockResolvedValue(mockItems) }

describe('QuizzesService', () => {
  let service: QuizzesService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuizzesService,
        { provide: QuizModel, useValue: mockQuizModel },
        { provide: QuizAttemptModel, useValue: mockAttemptModel },
        { provide: ProgressModel, useValue: mockProgressModel },
        { provide: TrailModel, useValue: mockTrailModel },
      ],
    }).compile()

    service = module.get<QuizzesService>(QuizzesService)
  })

  afterEach(() => jest.clearAllMocks())

  describe('submit — cálculo de nota', () => {
    it('deve calcular 100% com todas as respostas corretas', async () => {
      const result = await service.submit('quiz-001', 'user-123', {
        trailId: 'trail-001',
        itemId: 'item-1',
        answers: [
          { questionId: 'q1', selectedOptionId: 'b' },
          { questionId: 'q2', selectedOptionId: 'd' },
          { questionId: 'q3', selectedOptionId: 'f' },
        ],
      })
      expect(result.score).toBe(100)
      expect(result.passed).toBe(true)
      expect(result.correctCount).toBe(3)
    })

    it('deve calcular 33% com 1 de 3 respostas corretas e reprovar (mínimo 70)', async () => {
      mockAttemptModel.create.mockResolvedValueOnce({ id: 'a2', score: 33, passed: false })
      const result = await service.submit('quiz-001', 'user-123', {
        trailId: 'trail-001',
        itemId: 'item-1',
        answers: [
          { questionId: 'q1', selectedOptionId: 'b' },
          { questionId: 'q2', selectedOptionId: 'c' },
          { questionId: 'q3', selectedOptionId: 'e' },
        ],
      })
      expect(result.score).toBe(33)
      expect(result.passed).toBe(false)
      expect(mockProgressModel.completeItem).not.toHaveBeenCalled()
    })

    it('deve desbloquear próximo item ao passar', async () => {
      const result = await service.submit('quiz-001', 'user-123', {
        trailId: 'trail-001',
        itemId: 'item-1',
        answers: [
          { questionId: 'q1', selectedOptionId: 'b' },
          { questionId: 'q2', selectedOptionId: 'd' },
          { questionId: 'q3', selectedOptionId: 'f' },
        ],
      })
      expect(result.unlockedNextItem).toBe(true)
      expect(mockProgressModel.updateCurrentItem).toHaveBeenCalledWith(
        'user-123', 'trail-001', 1,
      )
    })

    it('deve completar a trilha quando for o último item', async () => {
      mockTrailModel.getItems.mockResolvedValueOnce([
        { id: 'item-1', trailId: 'trail-001', order: 0, contentId: 'c1', type: 'quiz' },
      ])
      const result = await service.submit('quiz-001', 'user-123', {
        trailId: 'trail-001',
        itemId: 'item-1',
        answers: [
          { questionId: 'q1', selectedOptionId: 'b' },
          { questionId: 'q2', selectedOptionId: 'd' },
          { questionId: 'q3', selectedOptionId: 'f' },
        ],
      })
      expect(result.unlockedNextItem).toBe(false)
      expect(mockProgressModel.completeTrail).toHaveBeenCalledWith('user-123', 'trail-001')
    })
  })
})
