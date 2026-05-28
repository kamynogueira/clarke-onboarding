import { Test, TestingModule } from '@nestjs/testing'
import { TrailsService } from './trails.service'
import { TrailModel } from '@models/trail.model'
import { UserModel } from '@models/user.model'

const mockTrail = {
  id: 'trail-001',
  title: 'Onboarding Geral',
  description: 'Trilha obrigatória para todos os colaboradores',
  status: 'published' as const,
  minScoreToAdvance: 70,
  assignedTo: { userIds: [], teams: ['Engineering'], positions: [] },
  createdBy: 'admin-uid',
  createdAt: new Date(),
  updatedAt: new Date(),
}

const mockItems = [
  { id: 'item-1', trailId: 'trail-001', order: 0, contentId: 'content-1', type: 'pdf' as const },
  { id: 'item-2', trailId: 'trail-001', order: 1, contentId: 'content-2', type: 'video' as const },
]

const mockUser = {
  uid: 'user-123',
  team: 'Engineering',
  position: 'Analista',
}

const mockTrailModel = {
  findAll: jest.fn().mockResolvedValue({ data: [mockTrail], total: 1 }),
  findById: jest.fn().mockResolvedValue(mockTrail),
  findAssignedToUser: jest.fn().mockResolvedValue([mockTrail]),
  getItems: jest.fn().mockResolvedValue(mockItems),
  create: jest.fn().mockResolvedValue(mockTrail),
  update: jest.fn().mockResolvedValue(mockTrail),
  delete: jest.fn().mockResolvedValue(undefined),
  addItem: jest.fn().mockResolvedValue(mockItems[0]),
  updateItemOrder: jest.fn().mockResolvedValue(undefined),
  removeItem: jest.fn().mockResolvedValue(undefined),
}

const mockUserModel = {
  findById: jest.fn().mockResolvedValue(mockUser),
}

describe('TrailsService', () => {
  let service: TrailsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrailsService,
        { provide: TrailModel, useValue: mockTrailModel },
        { provide: UserModel, useValue: mockUserModel },
      ],
    }).compile()

    service = module.get<TrailsService>(TrailsService)
  })

  afterEach(() => jest.clearAllMocks())

  describe('findByIdWithItems', () => {
    it('deve retornar trilha com itens ordenados', async () => {
      const result = await service.findByIdWithItems('trail-001')
      expect(result.id).toBe('trail-001')
      expect(result.items).toHaveLength(2)
      expect(result.items[0].order).toBe(0)
    })
  })

  describe('findAssignedToUser', () => {
    it('deve buscar trilhas baseado em time e cargo do usuário', async () => {
      const result = await service.findAssignedToUser('user-123')
      expect(mockUserModel.findById).toHaveBeenCalledWith('user-123')
      expect(mockTrailModel.findAssignedToUser).toHaveBeenCalledWith(
        'user-123',
        'Engineering',
        'Analista',
      )
      expect(result).toHaveLength(1)
    })
  })

  describe('reorderItems', () => {
    it('deve chamar updateItemOrder para cada item', async () => {
      await service.reorderItems('trail-001', {
        items: [
          { itemId: 'item-1', order: 1 },
          { itemId: 'item-2', order: 0 },
        ],
      })
      expect(mockTrailModel.updateItemOrder).toHaveBeenCalledTimes(2)
    })
  })

  describe('create', () => {
    it('deve criar trilha com createdBy do usuário autenticado', async () => {
      await service.create(
        {
          title: 'Nova Trilha',
          description: 'Descrição da trilha',
          status: 'draft',
          minScoreToAdvance: 70,
          assignedTo: { userIds: [], teams: [], positions: [] },
        },
        'admin-uid',
      )
      expect(mockTrailModel.create).toHaveBeenCalledWith(
        expect.objectContaining({ createdBy: 'admin-uid' }),
      )
    })
  })
})
