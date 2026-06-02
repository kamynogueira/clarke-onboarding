import { Test, TestingModule } from '@nestjs/testing'
import { ForbiddenException } from '@nestjs/common'
import { ProgressService } from './progress.service'
import { ProgressModel, TrailProgress, ItemProgress } from '@models/progress.model'
import { TrailModel } from '@models/trail.model'
import { UserModel } from '@models/user.model'

const mockUser = {
  uid: 'user-001',
  name: 'Ana Silva',
  email: 'ana@clarke.com.br',
  team: 'Vendas',
  position: 'Analista',
  role: 'collaborator',
}

const mockTrail = {
  id: 'trail-001',
  title: 'Onboarding Comercial',
}

const mockItems = [
  { id: 'item-1', trailId: 'trail-001', order: 0, contentId: 'c1', type: 'video' as const },
  { id: 'item-2', trailId: 'trail-001', order: 1, contentId: 'c2', type: 'pdf' as const },
]

const mockTrailProgress: TrailProgress = {
  userId: 'user-001',
  trailId: 'trail-001',
  status: 'in_progress',
  currentItemOrder: 0,
  startedAt: new Date('2024-01-01'),
}

const mockItemsProgress: ItemProgress[] = [
  { userId: 'user-001', trailId: 'trail-001', itemId: 'item-1', status: 'completed', completedAt: new Date() },
  { userId: 'user-001', trailId: 'trail-001', itemId: 'item-2', status: 'pending' },
]

const mockProgressModel = {
  getTrailProgress: jest.fn(),
  getAllTrailsProgress: jest.fn(),
  startTrail: jest.fn(),
  completeItem: jest.fn(),
  updateCurrentItem: jest.fn(),
  completeTrail: jest.fn(),
  getAllItemsProgress: jest.fn(),
  getUsersProgressByTrail: jest.fn(),
}

const mockTrailModel = {
  findById: jest.fn().mockResolvedValue(mockTrail),
  getItems: jest.fn().mockResolvedValue(mockItems),
}

const mockUserModel = {
  findById: jest.fn().mockResolvedValue(mockUser),
}

describe('ProgressService', () => {
  let service: ProgressService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProgressService,
        { provide: ProgressModel, useValue: mockProgressModel },
        { provide: TrailModel, useValue: mockTrailModel },
        { provide: UserModel, useValue: mockUserModel },
      ],
    }).compile()

    service = module.get<ProgressService>(ProgressService)
  })

  afterEach(() => jest.clearAllMocks())

  describe('startTrail', () => {
    it('deve iniciar trilha quando não há progresso existente', async () => {
      mockProgressModel.getTrailProgress.mockResolvedValue(null)
      mockProgressModel.startTrail.mockResolvedValue(mockTrailProgress)

      const result = await service.startTrail('user-001', { trailId: 'trail-001' })

      expect(mockProgressModel.startTrail).toHaveBeenCalledWith('user-001', 'trail-001')
      expect(result.status).toBe('in_progress')
    })

    it('deve retornar progresso existente sem criar novo registro', async () => {
      mockProgressModel.getTrailProgress.mockResolvedValue(mockTrailProgress)

      const result = await service.startTrail('user-001', { trailId: 'trail-001' })

      expect(mockProgressModel.startTrail).not.toHaveBeenCalled()
      expect(result).toEqual(mockTrailProgress)
    })
  })

  describe('getMyTrailProgress', () => {
    it('deve calcular percentual de conclusão corretamente', async () => {
      mockProgressModel.getTrailProgress.mockResolvedValue(mockTrailProgress)
      mockProgressModel.getAllItemsProgress.mockResolvedValue(mockItemsProgress)
      mockTrailModel.getItems.mockResolvedValue(mockItems)

      const result = await service.getMyTrailProgress('user-001', 'trail-001')

      expect(result.totalItems).toBe(2)
      expect(result.completedItems).toBe(1)
      expect(result.percentComplete).toBe(50)
    })

    it('deve retornar 100% quando todos os itens estão concluídos', async () => {
      const allCompleted: ItemProgress[] = mockItems.map((i) => ({
        userId: 'user-001', trailId: 'trail-001', itemId: i.id, status: 'completed', completedAt: new Date(),
      }))
      mockProgressModel.getTrailProgress.mockResolvedValue(mockTrailProgress)
      mockProgressModel.getAllItemsProgress.mockResolvedValue(allCompleted)
      mockTrailModel.getItems.mockResolvedValue(mockItems)

      const result = await service.getMyTrailProgress('user-001', 'trail-001')

      expect(result.percentComplete).toBe(100)
    })

    it('deve retornar status not_started quando trilha ainda não foi iniciada', async () => {
      mockProgressModel.getTrailProgress.mockResolvedValue(null)
      mockProgressModel.getAllItemsProgress.mockResolvedValue([])
      mockTrailModel.getItems.mockResolvedValue(mockItems)

      const result = await service.getMyTrailProgress('user-001', 'trail-001')

      expect(result.trail.status).toBe('not_started')
      expect(result.percentComplete).toBe(0)
    })

    it('deve retornar 0% quando a trilha não possui itens', async () => {
      mockProgressModel.getTrailProgress.mockResolvedValue(mockTrailProgress)
      mockProgressModel.getAllItemsProgress.mockResolvedValue([])
      mockTrailModel.getItems.mockResolvedValue([])

      const result = await service.getMyTrailProgress('user-001', 'trail-001')

      expect(result.percentComplete).toBe(0)
      expect(result.totalItems).toBe(0)
    })
  })

  describe('completeItem', () => {
    it('deve lançar ForbiddenException se o item não pertence à trilha', async () => {
      mockTrailModel.getItems.mockResolvedValue(mockItems)

      await expect(
        service.completeItem('user-001', { trailId: 'trail-001', itemId: 'item-inexistente' }),
      ).rejects.toThrow(ForbiddenException)
    })

    it('deve avançar para o próximo item quando há um seguinte', async () => {
      mockTrailModel.getItems.mockResolvedValue(mockItems)
      mockProgressModel.completeItem.mockResolvedValue(undefined)
      mockProgressModel.updateCurrentItem.mockResolvedValue(undefined)

      await service.completeItem('user-001', { trailId: 'trail-001', itemId: 'item-1' })

      expect(mockProgressModel.completeItem).toHaveBeenCalledWith('user-001', 'trail-001', 'item-1')
      expect(mockProgressModel.updateCurrentItem).toHaveBeenCalledWith('user-001', 'trail-001', 1)
      expect(mockProgressModel.completeTrail).not.toHaveBeenCalled()
    })

    it('deve completar a trilha quando o item concluído é o último', async () => {
      mockTrailModel.getItems.mockResolvedValueOnce([mockItems[1]])
      mockProgressModel.completeItem.mockResolvedValue(undefined)
      mockProgressModel.completeTrail.mockResolvedValue(undefined)

      await service.completeItem('user-001', { trailId: 'trail-001', itemId: 'item-2' })

      expect(mockProgressModel.completeTrail).toHaveBeenCalledWith('user-001', 'trail-001')
      expect(mockProgressModel.updateCurrentItem).not.toHaveBeenCalled()
    })
  })

  describe('getUserProgressForAdmin', () => {
    it('deve retornar dados do usuário com o progresso de cada trilha', async () => {
      mockUserModel.findById.mockResolvedValue(mockUser)
      mockProgressModel.getAllTrailsProgress.mockResolvedValue([mockTrailProgress])
      mockTrailModel.findById.mockResolvedValue(mockTrail)
      mockProgressModel.getAllItemsProgress.mockResolvedValue(mockItemsProgress)
      mockTrailModel.getItems.mockResolvedValue(mockItems)

      const result = await service.getUserProgressForAdmin('user-001')

      expect(result.uid).toBe('user-001')
      expect(result.name).toBe('Ana Silva')
      expect(result.trails).toHaveLength(1)
      expect(result.trails[0].trailTitle).toBe('Onboarding Comercial')
      expect(result.trails[0].percentComplete).toBe(50)
    })

    it('deve retornar lista de trilhas vazia quando usuário não iniciou nenhuma', async () => {
      mockUserModel.findById.mockResolvedValue(mockUser)
      mockProgressModel.getAllTrailsProgress.mockResolvedValue([])

      const result = await service.getUserProgressForAdmin('user-001')

      expect(result.trails).toHaveLength(0)
    })
  })
})
