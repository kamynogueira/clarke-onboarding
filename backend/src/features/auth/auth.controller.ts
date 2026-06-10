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
  RequestNew2FADto,
  RequestNew2FASchema,
  Verify2FADto,
  Verify2FASchema,
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
  @ApiOperation({ summary: 'Inicia login e envia código 2FA por e-mail' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password)
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

  @Public()
  @Post('2fa/verify')
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(Verify2FASchema))
  @ApiOperation({ summary: 'Verifica código 2FA e retorna custom token Firebase' })
  async verify2FA(@Body() dto: Verify2FADto) {
    return this.authService.verify2FA(dto.uid, dto.code)
  }

  @Public()
  @Post('2fa/resend')
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(RequestNew2FASchema))
  @ApiOperation({ summary: 'Reenvia o código 2FA para o e-mail' })
  async resend2FA(@Body() dto: RequestNew2FADto) {
    const user = await this.authService['userModel'].findById(dto.uid)
    await this.authService.send2FACode(user.uid, user.email, user.name)
    return { message: 'Código reenviado com sucesso' }
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
