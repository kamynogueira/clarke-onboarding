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
exports.ContentsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const contents_service_1 = require("./contents.service");
const contents_dto_1 = require("./dto/contents.dto");
const zod_validation_pipe_1 = require("../../common/pipes/zod-validation.pipe");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let ContentsController = class ContentsController {
    constructor(contentsService) {
        this.contentsService = contentsService;
    }
    async findAll(query) {
        return this.contentsService.findAll(query);
    }
    async findForLibrary(query) {
        return this.contentsService.findForLibrary(query);
    }
    async findById(id) {
        return this.contentsService.findById(id);
    }
    async create(dto, user) {
        return this.contentsService.create(dto, user.uid);
    }
    async update(id, dto) {
        return this.contentsService.update(id, dto);
    }
    async delete(id) {
        return this.contentsService.delete(id);
    }
};
exports.ContentsController = ContentsController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Lista todos os conteúdos (admin)' }),
    __param(0, (0, common_1.Query)(new zod_validation_pipe_1.ZodValidationPipe(contents_dto_1.ListContentsSchema))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ContentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('library'),
    (0, roles_decorator_1.Roles)('admin', 'collaborator'),
    (0, swagger_1.ApiOperation)({ summary: 'Lista conteúdos da biblioteca (admin e colaborador, sem quizzes)' }),
    __param(0, (0, common_1.Query)(new zod_validation_pipe_1.ZodValidationPipe(contents_dto_1.ListLibraryContentsSchema))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ContentsController.prototype, "findForLibrary", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Busca conteúdo por ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID do conteúdo' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContentsController.prototype, "findById", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Cria novo conteúdo (admin)' }),
    __param(0, (0, common_1.Body)(new zod_validation_pipe_1.ZodValidationPipe(contents_dto_1.CreateContentSchema))),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ContentsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Atualiza conteúdo (admin)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID do conteúdo' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)(new zod_validation_pipe_1.ZodValidationPipe(contents_dto_1.UpdateContentSchema))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ContentsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, common_1.HttpCode)(204),
    (0, swagger_1.ApiOperation)({ summary: 'Remove conteúdo (admin)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID do conteúdo' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContentsController.prototype, "delete", null);
exports.ContentsController = ContentsController = __decorate([
    (0, swagger_1.ApiTags)('Contents'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('contents'),
    __metadata("design:paramtypes", [contents_service_1.ContentsService])
], ContentsController);
//# sourceMappingURL=contents.controller.js.map