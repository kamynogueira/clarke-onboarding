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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const users_service_1 = require("./users.service");
const users_dto_1 = require("./dto/users.dto");
const zod_validation_pipe_1 = require("../../common/pipes/zod-validation.pipe");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async findAll(query) {
        return this.usersService.findAll(query);
    }
    async getMe(user) {
        return this.usersService.findMe(user.uid);
    }
    async updateMe(dto, currentUser) {
        return this.usersService.updateMe(currentUser.uid, dto, currentUser.role);
    }
    async getTeams() {
        return this.usersService.getTeams();
    }
    async getPositions() {
        return this.usersService.getPositions();
    }
    async approve(uid, dto) {
        return this.usersService.approve(uid, dto);
    }
    async reject(uid) {
        await this.usersService.reject(uid);
        return { message: 'Cadastro rejeitado com sucesso' };
    }
    async findById(uid) {
        return this.usersService.findById(uid);
    }
    async create(dto) {
        return this.usersService.create(dto);
    }
    async update(uid, dto) {
        return this.usersService.update(uid, dto);
    }
    async delete(uid) {
        return this.usersService.delete(uid);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Lista todos os usuários (admin)' }),
    __param(0, (0, common_1.Query)(new zod_validation_pipe_1.ZodValidationPipe(users_dto_1.ListUsersSchema))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, swagger_1.ApiOperation)({ summary: 'Retorna o usuário autenticado' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getMe", null);
__decorate([
    (0, common_1.Patch)('me'),
    (0, swagger_1.ApiOperation)({ summary: 'Atualiza dados do usuário autenticado' }),
    __param(0, (0, common_1.Body)(new zod_validation_pipe_1.ZodValidationPipe(users_dto_1.UpdateMeSchema))),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateMe", null);
__decorate([
    (0, common_1.Get)('teams'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Lista todos os times existentes' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getTeams", null);
__decorate([
    (0, common_1.Get)('positions'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Lista todos os cargos existentes' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getPositions", null);
__decorate([
    (0, common_1.Patch)(':uid/approve'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Aprova cadastro pendente (admin)' }),
    (0, swagger_1.ApiParam)({ name: 'uid', description: 'UID do usuário' }),
    __param(0, (0, common_1.Param)('uid')),
    __param(1, (0, common_1.Body)(new zod_validation_pipe_1.ZodValidationPipe(users_dto_1.ApproveUserSchema))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "approve", null);
__decorate([
    (0, common_1.Patch)(':uid/reject'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'Rejeita cadastro pendente (admin)' }),
    (0, swagger_1.ApiParam)({ name: 'uid', description: 'UID do usuário' }),
    __param(0, (0, common_1.Param)('uid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "reject", null);
__decorate([
    (0, common_1.Get)(':uid'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Busca usuário por UID (admin)' }),
    (0, swagger_1.ApiParam)({ name: 'uid', description: 'UID do usuário no Firebase' }),
    __param(0, (0, common_1.Param)('uid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findById", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('admin'),
    (0, common_1.UsePipes)(new zod_validation_pipe_1.ZodValidationPipe(users_dto_1.CreateUserSchema)),
    (0, swagger_1.ApiOperation)({ summary: 'Cria novo usuário (admin)' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':uid'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Atualiza usuário (admin)' }),
    (0, swagger_1.ApiParam)({ name: 'uid', description: 'UID do usuário no Firebase' }),
    __param(0, (0, common_1.Param)('uid')),
    __param(1, (0, common_1.Body)(new zod_validation_pipe_1.ZodValidationPipe(users_dto_1.UpdateUserSchema))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':uid'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, common_1.HttpCode)(204),
    (0, swagger_1.ApiOperation)({ summary: 'Remove usuário (admin)' }),
    (0, swagger_1.ApiParam)({ name: 'uid', description: 'UID do usuário no Firebase' }),
    __param(0, (0, common_1.Param)('uid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "delete", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)('Users'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map