"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const firebase_service_1 = require("../../core/firebase/firebase.service");
const user_model_1 = require("../../models/user.model");
const nodemailer = require("nodemailer");
let AuthService = AuthService_1 = class AuthService {
    constructor(firebase, userModel) {
        this.firebase = firebase;
        this.userModel = userModel;
        this.logger = new common_1.Logger(AuthService_1.name);
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }
    async login(email, password) {
        const user = await this.userModel.findByEmail(email);
        if (!user)
            throw new common_1.UnauthorizedException('Credenciais inválidas');
        const customToken = await this.firebase.auth.createCustomToken(user.uid, {
            role: user.role,
            team: user.team,
            position: user.position,
            displayName: user.name,
            userEmail: user.email,
        });
        return { customToken, uid: user.uid };
    }
    async send2FACode(uid, email, name) {
        const code = this.generateCode();
        const expiryMinutes = Number(process.env.TWO_FACTOR_CODE_EXPIRY_MINUTES ?? 10);
        const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);
        await this.userModel.set2FACode(uid, code, expiresAt);
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
        });
        this.logger.log(`Código 2FA enviado para ${email}`);
    }
    async verify2FA(uid, code) {
        const user = await this.userModel.findById(uid);
        if (!user.twoFactorCode || !user.twoFactorCodeExpiresAt) {
            throw new common_1.BadRequestException('Nenhum código de verificação pendente');
        }
        if (new Date() > new Date(user.twoFactorCodeExpiresAt)) {
            await this.userModel.clear2FACode(uid);
            throw new common_1.BadRequestException('Código expirado. Solicite um novo.');
        }
        if (user.twoFactorCode !== code) {
            throw new common_1.UnauthorizedException('Código inválido');
        }
        await this.userModel.clear2FACode(uid);
        const customToken = await this.firebase.auth.createCustomToken(uid, {
            role: user.role,
            team: user.team,
            position: user.position,
            displayName: user.name,
            userEmail: user.email,
        });
        return { customToken };
    }
    async setCustomClaims(uid, role) {
        await this.firebase.auth.setCustomUserClaims(uid, { role });
    }
    generateCode() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [firebase_service_1.FirebaseService,
        user_model_1.UserModel])
], AuthService);
//# sourceMappingURL=auth.service.js.map