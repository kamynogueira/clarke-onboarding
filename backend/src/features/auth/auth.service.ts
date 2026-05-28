import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common'
import { FirebaseService } from '@core/firebase/firebase.service'
import { UserModel } from '@models/user.model'
import * as nodemailer from 'nodemailer'

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)
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

  async login(email: string, password: string) {
    const user = await this.userModel.findByEmail(email)
    if (!user) throw new UnauthorizedException('Credenciais inválidas')

    await this.send2FACode(user.uid, user.email, user.name)

    return {
      requiresTwoFactor: true,
      uid: user.uid,
      message: 'Código de verificação enviado para o e-mail',
    }
  }

  async send2FACode(uid: string, email: string, name: string): Promise<void> {
    const code = this.generateCode()
    const expiryMinutes = Number(process.env.TWO_FACTOR_CODE_EXPIRY_MINUTES ?? 10)
    const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000)

    await this.userModel.set2FACode(uid, code, expiresAt)

    await this.transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Seu código de acesso — Clarke Energia',
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
          <h2>Olá, ${name}!</h2>
          <p>Seu código de verificação é:</p>
          <div style="font-size:36px;font-weight:bold;letter-spacing:8px;color:#1a1a1a;margin:24px 0">
            ${code}
          </div>
          <p style="color:#666">Este código expira em <strong>${expiryMinutes} minutos</strong>.</p>
          <p style="color:#999;font-size:12px">Se você não solicitou esse código, ignore este e-mail.</p>
        </div>
      `,
    })

    this.logger.log(`Código 2FA enviado para ${email}`)
  }

  async verify2FA(uid: string, code: string): Promise<{ customToken: string }> {
    const user = await this.userModel.findById(uid)

    if (!user.twoFactorCode || !user.twoFactorCodeExpiresAt) {
      throw new BadRequestException('Nenhum código de verificação pendente')
    }

    if (new Date() > new Date(user.twoFactorCodeExpiresAt)) {
      await this.userModel.clear2FACode(uid)
      throw new BadRequestException('Código expirado. Solicite um novo.')
    }

    if (user.twoFactorCode !== code) {
      throw new UnauthorizedException('Código inválido')
    }

    await this.userModel.clear2FACode(uid)

    const customToken = await this.firebase.auth.createCustomToken(uid, {
      role: user.role,
    })

    return { customToken }
  }

  async setCustomClaims(uid: string, role: string): Promise<void> {
    await this.firebase.auth.setCustomUserClaims(uid, { role })
  }

  private generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }
}
