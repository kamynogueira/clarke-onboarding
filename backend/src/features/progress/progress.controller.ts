import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'
import { ProgressService } from './progress.service'
import {
  CompleteItemDto,
  CompleteItemSchema,
  StartTrailDto,
  StartTrailSchema,
} from './dto/progress.dto'
import { ZodValidationPipe } from '@common/pipes/zod-validation.pipe'
import { Roles } from '@common/decorators/roles.decorator'
import { CurrentUser } from '@common/decorators/current-user.decorator'
import { DecodedIdToken } from 'firebase-admin/auth'

@ApiTags('Progress')
@ApiBearerAuth()
@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get('me')
  @ApiOperation({ summary: 'Retorna todo o progresso do colaborador autenticado' })
  async getMyProgress(@CurrentUser() user: DecodedIdToken) {
    return this.progressService.getMyAllProgress(user.uid)
  }

  @Get('me/trails/:trailId')
  @ApiOperation({ summary: 'Retorna progresso do colaborador em uma trilha específica' })
  @ApiParam({ name: 'trailId', description: 'ID da trilha' })
  async getMyTrailProgress(
    @Param('trailId') trailId: string,
    @CurrentUser() user: DecodedIdToken,
  ) {
    return this.progressService.getMyTrailProgress(user.uid, trailId)
  }

  @Post('start')
  @HttpCode(200)
  @ApiOperation({ summary: 'Inicia uma trilha para o colaborador autenticado' })
  async startTrail(
    @Body(new ZodValidationPipe(StartTrailSchema)) dto: StartTrailDto,
    @CurrentUser() user: DecodedIdToken,
  ) {
    return this.progressService.startTrail(user.uid, dto)
  }

  @Post('complete-item')
  @HttpCode(200)
  @ApiOperation({ summary: 'Marca item não-quiz como concluído (PDF, vídeo, gdoc)' })
  async completeItem(
    @Body(new ZodValidationPipe(CompleteItemSchema)) dto: CompleteItemDto,
    @CurrentUser() user: DecodedIdToken,
  ) {
    return this.progressService.completeItem(user.uid, dto)
  }

  @Get('admin/users/:uid')
  @Roles('admin')
  @ApiOperation({ summary: 'Retorna progresso completo de um usuário (admin)' })
  @ApiParam({ name: 'uid', description: 'UID do usuário' })
  async getUserProgress(@Param('uid') uid: string) {
    return this.progressService.getUserProgressForAdmin(uid)
  }

  @Get('admin/trails/:trailId')
  @Roles('admin')
  @ApiOperation({ summary: 'Retorna progresso de todos os usuários em uma trilha (admin)' })
  @ApiParam({ name: 'trailId', description: 'ID da trilha' })
  async getTrailProgress(@Param('trailId') trailId: string) {
    return this.progressService.getAllUsersProgressForTrail(trailId)
  }
}
