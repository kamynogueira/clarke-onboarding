import {
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common'
import { FirebaseService } from '@core/firebase/firebase.service'
import { UserModel } from '@models/user.model'
import { RegisterDto } from './dto/auth.dto'

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)

  constructor(
    private readonly firebase: FirebaseService,
    private readonly userModel: UserModel,
  ) {}

  async login(idToken: string) {
    const decoded = await this.firebase.auth.verifyIdToken(idToken)

    const user = await this.userModel.findByEmail(decoded.email!)
    if (!user) throw new UnauthorizedException('Usuário não encontrado')

    if (user.status === 'pending') {
      throw new ForbiddenException(
        'Seu cadastro ainda está em análise. Você receberá uma resposta por e-mail.',
      )
    }

    if (user.status === 'rejected') {
      throw new ForbiddenException(
        'Seu cadastro não foi aprovado. Entre em contato com o RH.',
      )
    }

    await this.firebase.auth.setCustomUserClaims(decoded.uid, {
      role: user.role,
      team: user.team,
      position: user.position,
      displayName: user.name,
      userEmail: user.email,
    })

    return { uid: decoded.uid }
  }

  async register(dto: RegisterDto): Promise<void> {
    const existing = await this.userModel.findByEmail(dto.email)
    if (existing) throw new ConflictException('Já existe um cadastro com este e-mail')

    const userRecord = await this.firebase.auth.createUser({
      email: dto.email,
      password: dto.password,
      displayName: dto.name,
      disabled: true,
    })

    await this.userModel.create(userRecord.uid, {
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      role: 'collaborator',
      position: '',
      team: '',
      startDate: '',
      twoFactorEnabled: true,
      status: 'pending',
    })
  }

  async changePassword(uid: string, newPassword: string): Promise<void> {
    await this.firebase.auth.updateUser(uid, { password: newPassword })
  }

  async setCustomClaims(uid: string, role: string): Promise<void> {
    await this.firebase.auth.setCustomUserClaims(uid, { role })
  }
}
