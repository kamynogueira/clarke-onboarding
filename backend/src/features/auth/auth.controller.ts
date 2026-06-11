import { Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { AuthService } from './auth.service'
import {
  ChangePasswordDto,
  ChangePasswordSchema,
  LoginDto,
  LoginSchema,
  RegisterDto,
  RegisterSchema,
} from './dto/auth.dto'
import { ZodValidationPipe } from '@common/pipes/zod-validation.pipe'
import { Public } from '@common/decorators/public.decorator'
import { CurrentUser } from '@common/decorators/current-user.decorator'
import { DecodedIdToken } from 'firebase-admin/auth'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(LoginSchema))
  @ApiOperation({ summary: 'Autentica usuário e retorna custom token Firebase' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto.idToken)
  }

  @Public()
  @Post('register')
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(RegisterSchema))
  @ApiOperation({ summary: 'Auto-cadastro — aguarda aprovação do admin' })
  async register(@Body() dto: RegisterDto) {
    await this.authService.register(dto)
    return { message: 'Cadastro enviado com sucesso. Você receberá uma resposta por e-mail.' }
  }

  @Post('change-password')
  @HttpCode(200)
  @ApiOperation({ summary: 'Altera a senha do usuário autenticado' })
  async changePassword(
    @Body(new ZodValidationPipe(ChangePasswordSchema)) dto: ChangePasswordDto,
    @CurrentUser() currentUser: DecodedIdToken,
  ) {
    await this.authService.changePassword(currentUser.uid, dto.newPassword)
    return { message: 'Senha alterada com sucesso' }
  }
}
