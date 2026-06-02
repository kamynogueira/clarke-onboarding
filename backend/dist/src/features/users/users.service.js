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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const firebase_service_1 = require("../../core/firebase/firebase.service");
const user_model_1 = require("../../models/user.model");
let UsersService = class UsersService {
    constructor(firebase, userModel) {
        this.firebase = firebase;
        this.userModel = userModel;
    }
    async findAll(filters) {
        const { data, total } = await this.userModel.findAll({
            role: filters.role,
            team: filters.team,
            position: filters.position,
            limit: filters.limit,
            offset: filters.offset,
        });
        return { data, total, limit: filters.limit, offset: filters.offset };
    }
    async findById(uid) {
        return this.userModel.findById(uid);
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
        return this.userModel.create(userRecord.uid, userInput);
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
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [firebase_service_1.FirebaseService,
        user_model_1.UserModel])
], UsersService);
//# sourceMappingURL=users.service.js.map