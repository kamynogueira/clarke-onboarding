import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { FirebaseService } from '@core/firebase/firebase.service'
import { UserModel, User } from '@models/user.model'
import { CreateUserDto, UpdateUserDto, ListUsersDto } from './dto/users.dto'

@Injectable()
export class UsersService {
  constructor(
    private readonly firebase: FirebaseService,
    private readonly userModel: UserModel,
  ) {}

  async findAll(filters: ListUsersDto): Promise<{ data: User[]; total: number; limit: number; offset: number }> {
    const { data, total } = await this.userModel.findAll({
      role: filters.role,
      team: filters.team,
      position: filters.position,
      limit: filters.limit,
      offset: filters.offset,
    })
    return { data, total, limit: filters.limit, offset: filters.offset }
  }

  async findById(uid: string): Promise<User> {
    return this.userModel.findById(uid)
  }

  async create(dto: CreateUserDto): Promise<User> {
    const existing = await this.userModel.findByEmail(dto.email)
    if (existing) {
      throw new ConflictException('Já existe um usuário com este e-mail')
    }

    const userRecord = await this.firebase.auth.createUser({
      email: dto.email,
      password: dto.password,
      displayName: dto.name,
    })

    await this.firebase.auth.setCustomUserClaims(userRecord.uid, {
      role: dto.role,
    })

    const { password: _, ...userInput } = dto
    return this.userModel.create(userRecord.uid, userInput)
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
}
