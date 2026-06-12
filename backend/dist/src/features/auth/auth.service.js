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
let AuthService = AuthService_1 = class AuthService {
    constructor(firebase, userModel) {
        this.firebase = firebase;
        this.userModel = userModel;
        this.logger = new common_1.Logger(AuthService_1.name);
    }
    async login(idToken) {
        const decoded = await this.firebase.auth.verifyIdToken(idToken);
        const user = await this.userModel.findByEmail(decoded.email);
        if (!user)
            throw new common_1.UnauthorizedException('Usuário não encontrado');
        if (user.status === 'pending') {
            throw new common_1.ForbiddenException('Seu cadastro ainda está em análise. Você receberá uma resposta por e-mail.');
        }
        if (user.status === 'rejected') {
            throw new common_1.ForbiddenException('Seu cadastro não foi aprovado. Entre em contato com o RH.');
        }
        await this.firebase.auth.setCustomUserClaims(decoded.uid, {
            role: user.role,
            team: user.team,
            position: user.position,
            displayName: user.name,
            userEmail: user.email,
        });
        return { uid: decoded.uid };
    }
    async register(dto) {
        const existing = await this.userModel.findByEmail(dto.email);
        if (existing)
            throw new common_1.ConflictException('Já existe um cadastro com este e-mail');
        const userRecord = await this.firebase.auth.createUser({
            email: dto.email,
            password: dto.password,
            displayName: dto.name,
            disabled: true,
        });
        await this.userModel.create(userRecord.uid, {
            name: dto.name,
            email: dto.email,
            phone: dto.phone,
            role: 'collaborator',
            position: '',
            team: '',
            startDate: '',
            twoFactorEnabled: true,
            status: 'pending',
        });
    }
    async changePassword(uid, newPassword) {
        await this.firebase.auth.updateUser(uid, { password: newPassword });
    }
    async setCustomClaims(uid, role) {
        await this.firebase.auth.setCustomUserClaims(uid, { role });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [firebase_service_1.FirebaseService,
        user_model_1.UserModel])
], AuthService);
//# sourceMappingURL=auth.service.js.map