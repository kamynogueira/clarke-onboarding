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
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'
import { ContentsService } from './contents.service'
import {
  CreateContentDto,
  CreateContentSchema,
  ListContentsDto,
  ListContentsSchema,
  UpdateContentDto,
  UpdateContentSchema,
} from './dto/contents.dto'
import { ZodValidationPipe } from '@common/pipes/zod-validation.pipe'
import { Roles } from '@common/decorators/roles.decorator'
import { CurrentUser } from '@common/decorators/current-user.decorator'
import { DecodedIdToken } from 'firebase-admin/auth'

@ApiTags('Contents')
@ApiBearerAuth()
@Controller('contents')
export class ContentsController {
  constructor(private readonly contentsService: ContentsService) {}

  @Get()
  @Roles('admin')
  @ApiOperation({ summary: 'Lista todos os conteúdos (admin)' })
  async findAll(
    @Query(new ZodValidationPipe(ListContentsSchema)) query: ListContentsDto,
  ) {
    return this.contentsService.findAll(query)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca conteúdo por ID' })
  @ApiParam({ name: 'id', description: 'ID do conteúdo' })
  async findById(@Param('id') id: string) {
    return this.contentsService.findById(id)
  }

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Cria novo conteúdo (admin)' })
  async create(
    @Body(new ZodValidationPipe(CreateContentSchema)) dto: CreateContentDto,
    @CurrentUser() user: DecodedIdToken,
  ) {
    return this.contentsService.create(dto, user.uid)
  }

  @Patch(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Atualiza conteúdo (admin)' })
  @ApiParam({ name: 'id', description: 'ID do conteúdo' })
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateContentSchema)) dto: UpdateContentDto,
  ) {
    return this.contentsService.update(id, dto)
  }

  @Delete(':id')
  @Roles('admin')
  @HttpCode(204)
  @ApiOperation({ summary: 'Remove conteúdo (admin)' })
  @ApiParam({ name: 'id', description: 'ID do conteúdo' })
  async delete(@Param('id') id: string) {
    return this.contentsService.delete(id)
  }
}
