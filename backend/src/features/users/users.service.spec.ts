import { Test, TestingModule } from '@nestjs/testing'
import { ConflictException, NotFoundException } from '@nestjs/common'
import { UsersService } from './users.service'
import { FirebaseService } from '@core/firebase/firebase.service'
import { UserModel } from '@models/user.model'

const mockUser = {
  uid: 'user-abc',
  name: 'Maria Souza',
  email: 'maria@clarke.com.br',
  phone: '11988887777',
  role: 'collaborator' as const,
  position: 'Analista',
  team: 'Marketing',
  startDate: '2024-03-01',
  twoFactorEnabled: true,
  createdAt: new Date(),
  updatedAt: new Date(),
}

const mockFirebase = {
  auth: {
    createUser: jest.fn().mockResolvedValue({ uid: 'user-abc' }),
    setCustomUserClaims: jest.fn().mockResolvedValue(undefined),
    updateUser: jest.fn().mockResolvedValue(undefined),
    deleteUser: jest.fn().mockResolvedValue(undefined),
  },
}

const mockUserModel = {
  findAll: jest.fn().mockResolvedValue({ data: [mockUser], total: 1 }),
  findById: jest.fn().mockResolvedValue(mockUser),
  findByEmail: jest.fn().mockResolvedValue(null),
  create: jest.fn().mockResolvedValue(mockUser),
  update: jest.fn().mockResolvedValue(mockUser),
  delete: jest.fn().mockResolvedValue(undefined),
}

describe('UsersService', () => {
  let service: UsersService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: FirebaseService, useValue: mockFirebase },
        { provide: UserModel, useValue: mockUserModel },
      ],
    }).compile()

    service = module.get<UsersService>(UsersService)
  })

  afterEach(() => jest.clearAllMocks())

  describe('findAll', () => {
    it('deve retornar lista paginada de usuários', async () => {
      const result = await service.findAll({ limit: 20, offset: 0 })
      expect(result.data).toHaveLength(1)
      expect(result.total).toBe(1)
    })
  })

  describe('findById', () => {
    it('deve retornar usuário por UID', async () => {
      const result = await service.findById('user-abc')
      expect(result.uid).toBe('user-abc')
    })

    it('deve lançar NotFoundException se usuário não existe', async () => {
      mockUserModel.findById.mockRejectedValueOnce(new NotFoundException())
      await expect(service.findById('inexistente')).rejects.toThrow(NotFoundException)
    })
  })

  describe('create', () => {
    const dto = {
      name: 'Maria Souza',
      email: 'maria@clarke.com.br',
      password: 'senha123',
      phone: '11988887777',
      role: 'collaborator' as const,
      position: 'Analista',
      team: 'Marketing',
      startDate: '2024-03-01',
      twoFactorEnabled: true,
    }

    it('deve criar usuário com sucesso', async () => {
      const result = await service.create(dto)
      expect(mockFirebase.auth.createUser).toHaveBeenCalledWith({
        email: dto.email,
        password: dto.password,
        displayName: dto.name,
      })
      expect(mockFirebase.auth.setCustomUserClaims).toHaveBeenCalledWith(
        'user-abc',
        { role: 'collaborator' },
      )
      expect(result.uid).toBe('user-abc')
    })

    it('deve lançar ConflictException se e-mail já existe', async () => {
      mockUserModel.findByEmail.mockResolvedValueOnce(mockUser)
      await expect(service.create(dto)).rejects.toThrow(ConflictException)
    })
  })

  describe('update', () => {
    it('deve atualizar custom claim ao mudar role', async () => {
      await service.update('user-abc', { role: 'admin' })
      expect(mockFirebase.auth.setCustomUserClaims).toHaveBeenCalledWith(
        'user-abc',
        { role: 'admin' },
      )
    })
  })

  describe('delete', () => {
    it('deve remover do Firebase Auth e do Firestore', async () => {
      await service.delete('user-abc')
      expect(mockFirebase.auth.deleteUser).toHaveBeenCalledWith('user-abc')
      expect(mockUserModel.delete).toHaveBeenCalledWith('user-abc')
    })
  })
})
