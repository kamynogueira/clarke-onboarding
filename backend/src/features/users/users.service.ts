import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
} from '@nestjs/common'
import { FirebaseService } from '@core/firebase/firebase.service'
import { UserModel, User } from '@models/user.model'
import {
  ApproveUserDto,
  CreateUserDto,
  ListUsersDto,
  UpdateMeDto,
  UpdateUserDto,
} from './dto/users.dto'
import * as nodemailer from 'nodemailer'

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name)
  private readonly transporter: nodemailer.Transporter

  constructor(
    private readonly firebase: FirebaseService,
    private readonly userModel: UserModel,
  ) {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  }

  async findAll(filters: ListUsersDto): Promise<{ data: User[]; total: number; limit: number; offset: number }> {
    const { data, total } = await this.userModel.findAll({
      role:     filters.role,
      team:     filters.team,
      position: filters.position,
      status:   filters.status,
      limit:    filters.limit,
      offset:   filters.offset,
    })
    return { data, total, limit: filters.limit, offset: filters.offset }
  }

  async findById(uid: string): Promise<User> {
    return this.userModel.findById(uid)
  }

  async findMe(uid: string): Promise<User> {
    return this.userModel.findById(uid)
  }

  async updateMe(uid: string, dto: UpdateMeDto, role: string): Promise<User> {
    const updateData: Partial<UpdateMeDto> = {}

    if (dto.name  !== undefined) updateData.name  = dto.name
    if (dto.phone !== undefined) updateData.phone = dto.phone

    if (role === 'admin') {
      if (dto.position  !== undefined) updateData.position  = dto.position
      if (dto.team      !== undefined) updateData.team      = dto.team
      if (dto.startDate !== undefined) updateData.startDate = dto.startDate
    }

    if (updateData.name) {
      await this.firebase.auth.updateUser(uid, { displayName: updateData.name })
      const user = await this.userModel.findById(uid)
      await this.firebase.auth.setCustomUserClaims(uid, {
        role:        user.role,
        team:        user.team,
        position:    user.position,
        displayName: updateData.name,
        userEmail:   user.email,
      })
    }

    return this.userModel.update(uid, updateData)
  }

  async create(dto: CreateUserDto): Promise<User> {
    const existing = await this.userModel.findByEmail(dto.email)
    if (existing) {
      throw new ConflictException('Já existe um usuário com este e-mail')
    }

    const userRecord = await this.firebase.auth.createUser({
      email:       dto.email,
      password:    dto.password,
      displayName: dto.name,
    })

    await this.firebase.auth.setCustomUserClaims(userRecord.uid, {
      role: dto.role,
    })

    const { password: _, ...userInput } = dto
    return this.userModel.create(userRecord.uid, { ...userInput, status: 'active' })
  }

  async approve(uid: string, dto: ApproveUserDto): Promise<User> {
    const user = await this.userModel.findById(uid)
    if (user.status !== 'pending') {
      throw new BadRequestException('Este usuário não está pendente de aprovação')
    }

    await this.firebase.auth.updateUser(uid, { disabled: false })
    await this.firebase.auth.setCustomUserClaims(uid, {
      role:        dto.role,
      team:        dto.team,
      position:    dto.position,
      displayName: user.name,
      userEmail:   user.email,
    })

    const updated = await this.userModel.update(uid, {
      status:    'active',
      role:      dto.role,
      position:  dto.position,
      team:      dto.team,
      startDate: dto.startDate,
    })

    await this.sendApprovalEmail(user.email, user.name)
    return updated
  }

  async reject(uid: string): Promise<void> {
    const user = await this.userModel.findById(uid)
    if (user.status !== 'pending') {
      throw new BadRequestException('Este usuário não está pendente de aprovação')
    }

    try {
      await this.firebase.auth.deleteUser(uid)
    } catch {
      // Firebase user already removed or never fully created
    }

    await this.userModel.update(uid, { status: 'rejected' })
    await this.sendRejectionEmail(user.email, user.name)
  }

  async update(uid: string, dto: UpdateUserDto): Promise<User> {
    await this.userModel.findById(uid)

    if (dto.role) {
      await this.firebase.auth.setCustomUserClaims(uid, { role: dto.role })
    }

    if (dto.name) {
      await this.firebase.auth.updateUser(uid, { displayName: dto.name })
    }

    return this.userModel.update(uid, dto)
  }

  async delete(uid: string): Promise<void> {
    await this.userModel.findById(uid)
    await this.firebase.auth.deleteUser(uid)
    await this.userModel.delete(uid)
  }

  async getTeams(): Promise<string[]> {
    const { data } = await this.userModel.findAll({ limit: 1000, offset: 0 })
    return [...new Set(data.map((u) => u.team).filter(Boolean))].sort()
  }

  async getPositions(): Promise<string[]> {
    const { data } = await this.userModel.findAll({ limit: 1000, offset: 0 })
    return [...new Set(data.map((u) => u.position).filter(Boolean))].sort()
  }

  private async sendApprovalEmail(email: string, name: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from:    process.env.SMTP_FROM,
        to:      email,
        subject: 'Seu cadastro foi aprovado — Clarke Energia',
        html: `
          <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
            <h2>Olá, ${name}!</h2>
            <p>Temos uma boa notícia: seu cadastro na plataforma Clarke Onboarding foi <strong>aprovado</strong>!</p>
            <p>Agora você já pode acessar a plataforma com o e-mail e senha cadastrados.</p>
            <p style="color:#999;font-size:12px">Se você não reconhece este cadastro, entre em contato com o RH.</p>
          </div>
        `,
      })
    } catch (e) {
      this.logger.error(`Falha ao enviar e-mail de aprovação para ${email}`, e)
    }
  }

  private async sendRejectionEmail(email: string, name: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from:    process.env.SMTP_FROM,
        to:      email,
        subject: 'Atualização sobre seu cadastro — Clarke Energia',
        html: `
          <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
            <h2>Olá, ${name}!</h2>
            <p>Infelizmente, seu cadastro na plataforma Clarke Onboarding <strong>não foi aprovado</strong>.</p>
            <p>Para mais informações, entre em contato com o RH da Clarke Energia.</p>
          </div>
        `,
      })
    } catch (e) {
      this.logger.error(`Falha ao enviar e-mail de rejeição para ${email}`, e)
    }
  }
}
