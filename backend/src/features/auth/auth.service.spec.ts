import { Test, TestingModule } from '@nestjs/testing'
import { BadRequestException, UnauthorizedException } from '@nestjs/common'
import { AuthService } from './auth.service'
import { FirebaseService } from '@core/firebase/firebase.service'
import { UserModel } from '@models/user.model'

const mockUser = {
  uid: 'user-123',
  name: 'João Silva',
  email: 'joao@clarke.com.br',
  phone: '11999999999',
  role: 'collaborator' as const,
  position: 'Analista',
  team: 'Engineering',
  startDate: '2024-01-01',
  twoFactorEnabled: true,
  twoFactorCode: '123456',
  twoFactorCodeExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
  createdAt: new Date(),
  updatedAt: new Date(),
}

const mockFirebase = {
  auth: {
    createCustomToken: jest.fn().mockResolvedValue('mock-custom-token'),
    setCustomUserClaims: jest.fn().mockResolvedValue(undefined),
  },
}

const mockUserModel = {
  findByEmail: jest.fn(),
  findById: jest.fn(),
  set2FACode: jest.fn().mockResolvedValue(undefined),
  clear2FACode: jest.fn().mockResolvedValue(undefined),
}

describe('AuthService', () => {
  let service: AuthService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: FirebaseService, useValue: mockFirebase },
        { provide: UserModel, useValue: mockUserModel },
      ],
    }).compile()

    service = module.get<AuthService>(AuthService)

    jest.spyOn(service as any, 'send2FACode').mockResolvedValue(undefined)
  })

  afterEach(() => jest.clearAllMocks())

  describe('login', () => {
    it('deve retornar requiresTwoFactor quando usuário existe', async () => {
      mockUserModel.findByEmail.mockResolvedValue(mockUser)

      const result = await service.login('joao@clarke.com.br', 'senha123')

      expect(result.requiresTwoFactor).toBe(true)
      expect(result.uid).toBe('user-123')
    })

    it('deve lançar UnauthorizedException quando usuário não existe', async () => {
      mockUserModel.findByEmail.mockResolvedValue(null)

      await expect(
        service.login('inexistente@clarke.com.br', 'senha123'),
      ).rejects.toThrow(UnauthorizedException)
    })
  })

  describe('verify2FA', () => {
    it('deve retornar customToken quando código é válido', async () => {
      mockUserModel.findById.mockResolvedValue(mockUser)

      const result = await service.verify2FA('user-123', '123456')

      expect(result.customToken).toBe('mock-custom-token')
      expect(mockUserModel.clear2FACode).toHaveBeenCalledWith('user-123')
    })

    it('deve lançar UnauthorizedException quando código é inválido', async () => {
      mockUserModel.findById.mockResolvedValue(mockUser)

      await expect(service.verify2FA('user-123', '000000')).rejects.toThrow(
        UnauthorizedException,
      )
    })

    it('deve lançar BadRequestException quando código está expirado', async () => {
      mockUserModel.findById.mockResolvedValue({
        ...mockUser,
        twoFactorCodeExpiresAt: new Date(Date.now() - 1000),
      })

      await expect(service.verify2FA('user-123', '123456')).rejects.toThrow(
        BadRequestException,
      )
    })

    it('deve lançar BadRequestException quando não há código pendente', async () => {
      mockUserModel.findById.mockResolvedValue({
        ...mockUser,
        twoFactorCode: null,
        twoFactorCodeExpiresAt: null,
      })

      await expect(service.verify2FA('user-123', '123456')).rejects.toThrow(
        BadRequestException,
      )
    })
  })
})
