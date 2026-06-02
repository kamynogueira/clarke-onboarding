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
exports.ProgressController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const progress_service_1 = require("./progress.service");
const progress_dto_1 = require("./dto/progress.dto");
const zod_validation_pipe_1 = require("../../common/pipes/zod-validation.pipe");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let ProgressController = class ProgressController {
    constructor(progressService) {
        this.progressService = progressService;
    }
    async getMyProgress(user) {
        return this.progressService.getMyAllProgress(user.uid);
    }
    async getMyTrailProgress(trailId, user) {
        return this.progressService.getMyTrailProgress(user.uid, trailId);
    }
    async startTrail(dto, user) {
        return this.progressService.startTrail(user.uid, dto);
    }
    async completeItem(dto, user) {
        return this.progressService.completeItem(user.uid, dto);
    }
    async getUserProgress(uid) {
        return this.progressService.getUserProgressForAdmin(uid);
    }
    async getTrailProgress(trailId) {
        return this.progressService.getAllUsersProgressForTrail(trailId);
    }
};
exports.ProgressController = ProgressController;
__decorate([
    (0, common_1.Get)('me'),
    (0, swagger_1.ApiOperation)({ summary: 'Retorna todo o progresso do colaborador autenticado' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProgressController.prototype, "getMyProgress", null);
__decorate([
    (0, common_1.Get)('me/trails/:trailId'),
    (0, swagger_1.ApiOperation)({ summary: 'Retorna progresso do colaborador em uma trilha específica' }),
    (0, swagger_1.ApiParam)({ name: 'trailId', description: 'ID da trilha' }),
    __param(0, (0, common_1.Param)('trailId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProgressController.prototype, "getMyTrailProgress", null);
__decorate([
    (0, common_1.Post)('start'),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'Inicia uma trilha para o colaborador autenticado' }),
    __param(0, (0, common_1.Body)(new zod_validation_pipe_1.ZodValidationPipe(progress_dto_1.StartTrailSchema))),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProgressController.prototype, "startTrail", null);
__decorate([
    (0, common_1.Post)('complete-item'),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'Marca item não-quiz como concluído (PDF, vídeo, gdoc)' }),
    __param(0, (0, common_1.Body)(new zod_validation_pipe_1.ZodValidationPipe(progress_dto_1.CompleteItemSchema))),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProgressController.prototype, "completeItem", null);
__decorate([
    (0, common_1.Get)('admin/users/:uid'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Retorna progresso completo de um usuário (admin)' }),
    (0, swagger_1.ApiParam)({ name: 'uid', description: 'UID do usuário' }),
    __param(0, (0, common_1.Param)('uid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProgressController.prototype, "getUserProgress", null);
__decorate([
    (0, common_1.Get)('admin/trails/:trailId'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Retorna progresso de todos os usuários em uma trilha (admin)' }),
    (0, swagger_1.ApiParam)({ name: 'trailId', description: 'ID da trilha' }),
    __param(0, (0, common_1.Param)('trailId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProgressController.prototype, "getTrailProgress", null);
exports.ProgressController = ProgressController = __decorate([
    (0, swagger_1.ApiTags)('Progress'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('progress'),
    __metadata("design:paramtypes", [progress_service_1.ProgressService])
], ProgressController);
//# sourceMappingURL=progress.controller.js.map