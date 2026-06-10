import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger'
import { UsersService } from './users.service'
import {
  ApproveUserDto,
  ApproveUserSchema,
  CreateUserDto,
  CreateUserSchema,
  ListUsersDto,
  ListUsersSchema,
  UpdateMeDto,
  UpdateMeSchema,
  UpdateUserDto,
  UpdateUserSchema,
} from './dto/users.dto'
import { ZodValidationPipe } from '@common/pipes/zod-validation.pipe'
import { Roles } from '@common/decorators/roles.decorator'
import { CurrentUser } from '@common/decorators/current-user.decorator'
import { DecodedIdToken } from 'firebase-admin/auth'

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles('admin')
  @ApiOperation({ summary: 'Lista todos os usuários (admin)' })
  async findAll(
    @Query(new ZodValidationPipe(ListUsersSchema)) query: ListUsersDto,
  ) {
    return this.usersService.findAll(query)
  }

  @Get('me')
  @ApiOperation({ summary: 'Retorna o usuário autenticado' })
  async getMe(@CurrentUser() user: DecodedIdToken) {
    return this.usersService.findMe(user.uid)
  }

  @Patch('me')
  @ApiOperation({ summary: 'Atualiza dados do usuário autenticado' })
  async updateMe(
    @Body(new ZodValidationPipe(UpdateMeSchema)) dto: UpdateMeDto,
    @CurrentUser() currentUser: DecodedIdToken,
  ) {
    return this.usersService.updateMe(currentUser.uid, dto, currentUser.role as string)
  }

  @Get('teams')
  @Roles('admin')
  @ApiOperation({ summary: 'Lista todos os times existentes' })
  async getTeams() {
    return this.usersService.getTeams()
  }

  @Get('positions')
  @Roles('admin')
  @ApiOperation({ summary: 'Lista todos os cargos existentes' })
  async getPositions() {
    return this.usersService.getPositions()
  }

  @Patch(':uid/approve')
  @Roles('admin')
  @ApiOperation({ summary: 'Aprova cadastro pendente (admin)' })
  @ApiParam({ name: 'uid', description: 'UID do usuário' })
  async approve(
    @Param('uid') uid: string,
    @Body(new ZodValidationPipe(ApproveUserSchema)) dto: ApproveUserDto,
  ) {
    return this.usersService.approve(uid, dto)
  }

  @Patch(':uid/reject')
  @Roles('admin')
  @HttpCode(200)
  @ApiOperation({ summary: 'Rejeita cadastro pendente (admin)' })
  @ApiParam({ name: 'uid', description: 'UID do usuário' })
  async reject(@Param('uid') uid: string) {
    await this.usersService.reject(uid)
    return { message: 'Cadastro rejeitado com sucesso' }
  }

  @Get(':uid')
  @Roles('admin')
  @ApiOperation({ summary: 'Busca usuário por UID (admin)' })
  @ApiParam({ name: 'uid', description: 'UID do usuário no Firebase' })
  async findById(@Param('uid') uid: string) {
    return this.usersService.findById(uid)
  }

  @Post()
  @Roles('admin')
  @UsePipes(new ZodValidationPipe(CreateUserSchema))
  @ApiOperation({ summary: 'Cria novo usuário (admin)' })
  async create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto)
  }

  @Patch(':uid')
  @Roles('admin')
  @ApiOperation({ summary: 'Atualiza usuário (admin)' })
  @ApiParam({ name: 'uid', description: 'UID do usuário no Firebase' })
  async update(
    @Param('uid') uid: string,
    @Body(new ZodValidationPipe(UpdateUserSchema)) dto: UpdateUserDto,
  ) {
    return this.usersService.update(uid, dto)
  }

  @Delete(':uid')
  @Roles('admin')
  @HttpCode(204)
  @ApiOperation({ summary: 'Remove usuário (admin)' })
  @ApiParam({ name: 'uid', description: 'UID do usuário no Firebase' })
  async delete(@Param('uid') uid: string) {
    return this.usersService.delete(uid)
  }
}
