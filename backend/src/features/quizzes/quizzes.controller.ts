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
import { QuizzesService } from './quizzes.service'
import {
  CreateQuizDto,
  CreateQuizSchema,
  ListQuizzesDto,
  ListQuizzesSchema,
  SubmitQuizDto,
  SubmitQuizSchema,
  UpdateQuizDto,
  UpdateQuizSchema,
} from './dto/quizzes.dto'
import { ZodValidationPipe } from '@common/pipes/zod-validation.pipe'
import { Roles } from '@common/decorators/roles.decorator'
import { CurrentUser } from '@common/decorators/current-user.decorator'
import { DecodedIdToken } from 'firebase-admin/auth'

@ApiTags('Quizzes')
@ApiBearerAuth()
@Controller('quizzes')
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Get()
  @Roles('admin')
  @ApiOperation({ summary: 'Lista todas as provas (admin)' })
  async findAll(
    @Query(new ZodValidationPipe(ListQuizzesSchema)) query: ListQuizzesDto,
  ) {
    return this.quizzesService.findAll(query)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca prova por ID' })
  @ApiParam({ name: 'id', description: 'ID da prova' })
  async findById(@Param('id') id: string) {
    return this.quizzesService.findById(id)
  }

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Cria nova prova (admin)' })
  async create(
    @Body(new ZodValidationPipe(CreateQuizSchema)) dto: CreateQuizDto,
    @CurrentUser() user: DecodedIdToken,
  ) {
    return this.quizzesService.create(dto, user.uid)
  }

  @Patch(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Atualiza prova (admin)' })
  @ApiParam({ name: 'id', description: 'ID da prova' })
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateQuizSchema)) dto: UpdateQuizDto,
  ) {
    return this.quizzesService.update(id, dto)
  }

  @Delete(':id')
  @Roles('admin')
  @HttpCode(204)
  @ApiOperation({ summary: 'Remove prova (admin)' })
  @ApiParam({ name: 'id', description: 'ID da prova' })
  async delete(@Param('id') id: string) {
    return this.quizzesService.delete(id)
  }

  @Post(':id/submit')
  @HttpCode(200)
  @ApiOperation({ summary: 'Envia respostas de uma prova (colaborador)' })
  @ApiParam({ name: 'id', description: 'ID da prova' })
  async submit(
    @Param('id') quizId: string,
    @Body(new ZodValidationPipe(SubmitQuizSchema)) dto: SubmitQuizDto,
    @CurrentUser() user: DecodedIdToken,
  ) {
    return this.quizzesService.submit(quizId, user.uid, dto)
  }

  @Get(':id/attempts')
  @ApiOperation({ summary: 'Lista tentativas do usuário autenticado para uma prova' })
  @ApiParam({ name: 'id', description: 'ID da prova' })
  async getMyAttempts(
    @Param('id') quizId: string,
    @CurrentUser() user: DecodedIdToken,
  ) {
    return this.quizzesService.getAttemptsByUser(user.uid, quizId)
  }
}
