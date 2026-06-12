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
var UsersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const firebase_service_1 = require("../../core/firebase/firebase.service");
const user_model_1 = require("../../models/user.model");
const nodemailer = require("nodemailer");
let UsersService = UsersService_1 = class UsersService {
    constructor(firebase, userModel) {
        this.firebase = firebase;
        this.userModel = userModel;
        this.logger = new common_1.Logger(UsersService_1.name);
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
    async findAll(filters) {
        const { data, total } = await this.userModel.findAll({
            role: filters.role,
            team: filters.team,
            position: filters.position,
            status: filters.status,
            limit: filters.limit,
            offset: filters.offset,
        });
        return { data, total, limit: filters.limit, offset: filters.offset };
    }
    async findById(uid) {
        return this.userModel.findById(uid);
    }
    async findMe(uid) {
        return this.userModel.findById(uid);
    }
    async updateMe(uid, dto, role) {
        const updateData = {};
        if (dto.name !== undefined)
            updateData.name = dto.name;
        if (dto.phone !== undefined)
            updateData.phone = dto.phone;
        if (role === 'admin') {
            if (dto.position !== undefined)
                updateData.position = dto.position;
            if (dto.team !== undefined)
                updateData.team = dto.team;
            if (dto.startDate !== undefined)
                updateData.startDate = dto.startDate;
        }
        if (updateData.name) {
            await this.firebase.auth.updateUser(uid, { displayName: updateData.name });
            const user = await this.userModel.findById(uid);
            await this.firebase.auth.setCustomUserClaims(uid, {
                role: user.role,
                team: user.team,
                position: user.position,
                displayName: updateData.name,
                userEmail: user.email,
            });
        }
        return this.userModel.update(uid, updateData);
    }
    async create(dto) {
        const existing = await this.userModel.findByEmail(dto.email);
        if (existing) {
            throw new common_1.ConflictException('Já existe um usuário com este e-mail');
        }
        const userRecord = await this.firebase.auth.createUser({
            email: dto.email,
            password: dto.password,
            displayName: dto.name,
        });
        await this.firebase.auth.setCustomUserClaims(userRecord.uid, {
            role: dto.role,
        });
        const { password: _, ...userInput } = dto;
        return this.userModel.create(userRecord.uid, { ...userInput, status: 'active' });
    }
    async approve(uid, dto) {
        const user = await this.userModel.findById(uid);
        if (user.status !== 'pending') {
            throw new common_1.BadRequestException('Este usuário não está pendente de aprovação');
        }
        await this.firebase.auth.updateUser(uid, { disabled: false });
        await this.firebase.auth.setCustomUserClaims(uid, {
            role: dto.role,
            team: dto.team,
            position: dto.position,
            displayName: user.name,
            userEmail: user.email,
        });
        const updated = await this.userModel.update(uid, {
            status: 'active',
            role: dto.role,
            position: dto.position,
            team: dto.team,
            startDate: dto.startDate,
        });
        await this.sendApprovalEmail(user.email, user.name);
        return updated;
    }
    async reject(uid) {
        const user = await this.userModel.findById(uid);
        if (user.status !== 'pending') {
            throw new common_1.BadRequestException('Este usuário não está pendente de aprovação');
        }
        try {
            await this.firebase.auth.deleteUser(uid);
        }
        catch {
        }
        await this.userModel.update(uid, { status: 'rejected' });
        await this.sendRejectionEmail(user.email, user.name);
    }
    async update(uid, dto) {
        await this.userModel.findById(uid);
        if (dto.role) {
            await this.firebase.auth.setCustomUserClaims(uid, { role: dto.role });
        }
        if (dto.name) {
            await this.firebase.auth.updateUser(uid, { displayName: dto.name });
        }
        return this.userModel.update(uid, dto);
    }
    async delete(uid) {
        await this.userModel.findById(uid);
        await this.firebase.auth.deleteUser(uid);
        await this.userModel.delete(uid);
    }
    async getTeams() {
        const { data } = await this.userModel.findAll({ limit: 1000, offset: 0 });
        return [...new Set(data.map((u) => u.team).filter(Boolean))].sort();
    }
    async getPositions() {
        const { data } = await this.userModel.findAll({ limit: 1000, offset: 0 });
        return [...new Set(data.map((u) => u.position).filter(Boolean))].sort();
    }
    async sendApprovalEmail(email, name) {
        try {
            await this.transporter.sendMail({
                from: process.env.SMTP_FROM,
                to: email,
                subject: 'Seu cadastro foi aprovado — Clarke Energia',
                html: `
          <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
            <h2>Olá, ${name}!</h2>
            <p>Temos uma boa notícia: seu cadastro na plataforma Clarke Onboarding foi <strong>aprovado</strong>!</p>
            <p>Agora você já pode acessar a plataforma com o e-mail e senha cadastrados.</p>
            <p style="color:#999;font-size:12px">Se você não reconhece este cadastro, entre em contato com o RH.</p>
          </div>
        `,
            });
        }
        catch (e) {
            this.logger.error(`Falha ao enviar e-mail de aprovação para ${email}`, e);
        }
    }
    async sendRejectionEmail(email, name) {
        try {
            await this.transporter.sendMail({
                from: process.env.SMTP_FROM,
                to: email,
                subject: 'Atualização sobre seu cadastro — Clarke Energia',
                html: `
          <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
            <h2>Olá, ${name}!</h2>
            <p>Infelizmente, seu cadastro na plataforma Clarke Onboarding <strong>não foi aprovado</strong>.</p>
            <p>Para mais informações, entre em contato com o RH da Clarke Energia.</p>
          </div>
        `,
            });
        }
        catch (e) {
            this.logger.error(`Falha ao enviar e-mail de rejeição para ${email}`, e);
        }
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = UsersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [firebase_service_1.FirebaseService,
        user_model_1.UserModel])
], UsersService);
//# sourceMappingURL=users.service.js.map