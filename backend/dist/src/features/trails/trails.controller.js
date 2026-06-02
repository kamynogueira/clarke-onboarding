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
exports.TrailsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const trails_service_1 = require("./trails.service");
const trails_dto_1 = require("./dto/trails.dto");
const zod_validation_pipe_1 = require("../../common/pipes/zod-validation.pipe");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let TrailsController = class TrailsController {
    constructor(trailsService) {
        this.trailsService = trailsService;
    }
    async findAll(query) {
        return this.trailsService.findAll(query);
    }
    async findMine(user) {
        return this.trailsService.findAssignedToUser(user.uid);
    }
    async findById(id) {
        return this.trailsService.findByIdWithItems(id);
    }
    async create(dto, user) {
        return this.trailsService.create(dto, user.uid);
    }
    async update(id, dto) {
        return this.trailsService.update(id, dto);
    }
    async delete(id) {
        return this.trailsService.delete(id);
    }
    async getItems(id) {
        return this.trailsService.getItems(id);
    }
    async addItem(trailId, dto) {
        return this.trailsService.addItem(trailId, dto);
    }
    async reorderItems(trailId, dto) {
        return this.trailsService.reorderItems(trailId, dto);
    }
    async removeItem(trailId, itemId) {
        return this.trailsService.removeItem(trailId, itemId);
    }
};
exports.TrailsController = TrailsController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Lista todas as trilhas (admin)' }),
    __param(0, (0, common_1.Query)(new zod_validation_pipe_1.ZodValidationPipe(trails_dto_1.ListTrailsSchema))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TrailsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('my'),
    (0, swagger_1.ApiOperation)({ summary: 'Lista trilhas atribuídas ao colaborador autenticado' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TrailsController.prototype, "findMine", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Busca trilha por ID com seus itens' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID da trilha' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TrailsController.prototype, "findById", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Cria nova trilha (admin)' }),
    __param(0, (0, common_1.Body)(new zod_validation_pipe_1.ZodValidationPipe(trails_dto_1.CreateTrailSchema))),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TrailsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Atualiza trilha (admin)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID da trilha' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)(new zod_validation_pipe_1.ZodValidationPipe(trails_dto_1.UpdateTrailSchema))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TrailsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, common_1.HttpCode)(204),
    (0, swagger_1.ApiOperation)({ summary: 'Remove trilha e seus itens (admin)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID da trilha' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TrailsController.prototype, "delete", null);
__decorate([
    (0, common_1.Get)(':id/items'),
    (0, swagger_1.ApiOperation)({ summary: 'Lista itens de uma trilha em ordem' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID da trilha' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TrailsController.prototype, "getItems", null);
__decorate([
    (0, common_1.Post)(':id/items'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Adiciona conteúdo a uma trilha (admin)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID da trilha' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)(new zod_validation_pipe_1.ZodValidationPipe(trails_dto_1.AddTrailItemSchema))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TrailsController.prototype, "addItem", null);
__decorate([
    (0, common_1.Put)(':id/items/reorder'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, common_1.HttpCode)(204),
    (0, swagger_1.ApiOperation)({ summary: 'Reordena itens de uma trilha (admin)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID da trilha' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)(new zod_validation_pipe_1.ZodValidationPipe(trails_dto_1.ReorderTrailItemsSchema))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TrailsController.prototype, "reorderItems", null);
__decorate([
    (0, common_1.Delete)(':id/items/:itemId'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, common_1.HttpCode)(204),
    (0, swagger_1.ApiOperation)({ summary: 'Remove item de uma trilha (admin)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID da trilha' }),
    (0, swagger_1.ApiParam)({ name: 'itemId', description: 'ID do item' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('itemId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TrailsController.prototype, "removeItem", null);
exports.TrailsController = TrailsController = __decorate([
    (0, swagger_1.ApiTags)('Trails'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('trails'),
    __metadata("design:paramtypes", [trails_service_1.TrailsService])
], TrailsController);
//# sourceMappingURL=trails.controller.js.map