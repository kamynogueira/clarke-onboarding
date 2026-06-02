import { Test, TestingModule } from '@nestjs/testing'
import { ContentsService } from './contents.service'
import { ContentModel, Content } from '@models/content.model'

const mockContent: Content = {
  id: 'content-001',
  title: 'Introdução à Clarke',
  description: 'Vídeo sobre a empresa',
  type: 'video',
  youtubeId: 'abc123',
  createdBy: 'admin-uid',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
}

const mockContentModel = {
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
}

describe('ContentsService', () => {
  let service: ContentsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContentsService,
        { provide: ContentModel, useValue: mockContentModel },
      ],
    }).compile()

    service = module.get<ContentsService>(ContentsService)
  })

  afterEach(() => jest.clearAllMocks())

  describe('findAll', () => {
    it('deve retornar lista paginada de conteúdos', async () => {
      mockContentModel.findAll.mockResolvedValue({ data: [mockContent], total: 1 })

      const result = await service.findAll({ limit: 10, offset: 0 })

      expect(result.data).toHaveLength(1)
      expect(result.total).toBe(1)
      expect(result.limit).toBe(10)
      expect(result.offset).toBe(0)
    })

    it('deve repassar filtros ao model', async () => {
      mockContentModel.findAll.mockResolvedValue({ data: [], total: 0 })

      await service.findAll({ type: 'pdf', limit: 5, offset: 10 })

      expect(mockContentModel.findAll).toHaveBeenCalledWith({ type: 'pdf', limit: 5, offset: 10 })
    })
  })

  describe('findById', () => {
    it('deve retornar conteúdo pelo id', async () => {
      mockContentModel.findById.mockResolvedValue(mockContent)

      const result = await service.findById('content-001')

      expect(result).toEqual(mockContent)
      expect(mockContentModel.findById).toHaveBeenCalledWith('content-001')
    })
  })

  describe('create', () => {
    it('deve criar conteúdo injetando createdBy do usuário autenticado', async () => {
      const dto = { title: 'Novo PDF', description: 'Descrição', type: 'pdf' as const }
      const expected = { ...mockContent, ...dto, createdBy: 'admin-uid' }
      mockContentModel.create.mockResolvedValue(expected)

      const result = await service.create(dto, 'admin-uid')

      expect(mockContentModel.create).toHaveBeenCalledWith({ ...dto, createdBy: 'admin-uid' })
      expect(result.createdBy).toBe('admin-uid')
    })
  })

  describe('update', () => {
    it('deve atualizar conteúdo existente', async () => {
      const dto = { title: 'Título atualizado' }
      mockContentModel.update.mockResolvedValue({ ...mockContent, ...dto })

      const result = await service.update('content-001', dto)

      expect(mockContentModel.update).toHaveBeenCalledWith('content-001', dto)
      expect(result.title).toBe('Título atualizado')
    })
  })

  describe('delete', () => {
    it('deve remover conteúdo por id', async () => {
      mockContentModel.delete.mockResolvedValue(undefined)

      await service.delete('content-001')

      expect(mockContentModel.delete).toHaveBeenCalledWith('content-001')
    })
  })
})
