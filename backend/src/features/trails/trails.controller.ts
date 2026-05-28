import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger'
import { TrailsService } from './trails.service'
import {
  AddTrailItemDto,
  AddTrailItemSchema,
  CreateTrailDto,
  CreateTrailSchema,
  ListTrailsDto,
  ListTrailsSchema,
  ReorderTrailItemsDto,
  ReorderTrailItemsSchema,
  UpdateTrailDto,
  UpdateTrailSchema,
} from './dto/trails.dto'
import { ZodValidationPipe } from '@common/pipes/zod-validation.pipe'
import { Roles } from '@common/decorators/roles.decorator'
import { CurrentUser } from '@common/decorators/current-user.decorator'
import { DecodedIdToken } from 'firebase-admin/auth'

@ApiTags('Trails')
@ApiBearerAuth()
@Controller('trails')
export class TrailsController {
  constructor(private readonly trailsService: TrailsService) {}

  @Get()
  @Roles('admin')
  @ApiOperation({ summary: 'Lista todas as trilhas (admin)' })
  async findAll(
    @Query(new ZodValidationPipe(ListTrailsSchema)) query: ListTrailsDto,
  ) {
    return this.trailsService.findAll(query)
  }

  @Get('my')
  @ApiOperation({ summary: 'Lista trilhas atribuídas ao colaborador autenticado' })
  async findMine(@CurrentUser() user: DecodedIdToken) {
    return this.trailsService.findAssignedToUser(user.uid)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca trilha por ID com seus itens' })
  @ApiParam({ name: 'id', description: 'ID da trilha' })
  async findById(@Param('id') id: string) {
    return this.trailsService.findByIdWithItems(id)
  }

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Cria nova trilha (admin)' })
  async create(
    @Body(new ZodValidationPipe(CreateTrailSchema)) dto: CreateTrailDto,
    @CurrentUser() user: DecodedIdToken,
  ) {
    return this.trailsService.create(dto, user.uid)
  }

  @Patch(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Atualiza trilha (admin)' })
  @ApiParam({ name: 'id', description: 'ID da trilha' })
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateTrailSchema)) dto: UpdateTrailDto,
  ) {
    return this.trailsService.update(id, dto)
  }

  @Delete(':id')
  @Roles('admin')
  @HttpCode(204)
  @ApiOperation({ summary: 'Remove trilha e seus itens (admin)' })
  @ApiParam({ name: 'id', description: 'ID da trilha' })
  async delete(@Param('id') id: string) {
    return this.trailsService.delete(id)
  }

  @Get(':id/items')
  @ApiOperation({ summary: 'Lista itens de uma trilha em ordem' })
  @ApiParam({ name: 'id', description: 'ID da trilha' })
  async getItems(@Param('id') id: string) {
    return this.trailsService.getItems(id)
  }

  @Post(':id/items')
  @Roles('admin')
  @ApiOperation({ summary: 'Adiciona conteúdo a uma trilha (admin)' })
  @ApiParam({ name: 'id', description: 'ID da trilha' })
  async addItem(
    @Param('id') trailId: string,
    @Body(new ZodValidationPipe(AddTrailItemSchema)) dto: AddTrailItemDto,
  ) {
    return this.trailsService.addItem(trailId, dto)
  }

  @Put(':id/items/reorder')
  @Roles('admin')
  @HttpCode(204)
  @ApiOperation({ summary: 'Reordena itens de uma trilha (admin)' })
  @ApiParam({ name: 'id', description: 'ID da trilha' })
  async reorderItems(
    @Param('id') trailId: string,
    @Body(new ZodValidationPipe(ReorderTrailItemsSchema)) dto: ReorderTrailItemsDto,
  ) {
    return this.trailsService.reorderItems(trailId, dto)
  }

  @Delete(':id/items/:itemId')
  @Roles('admin')
  @HttpCode(204)
  @ApiOperation({ summary: 'Remove item de uma trilha (admin)' })
  @ApiParam({ name: 'id', description: 'ID da trilha' })
  @ApiParam({ name: 'itemId', description: 'ID do item' })
  async removeItem(
    @Param('id') trailId: string,
    @Param('itemId') itemId: string,
  ) {
    return this.trailsService.removeItem(trailId, itemId)
  }
}
