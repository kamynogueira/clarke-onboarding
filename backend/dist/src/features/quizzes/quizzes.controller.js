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
exports.QuizzesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const quizzes_service_1 = require("./quizzes.service");
const quizzes_dto_1 = require("./dto/quizzes.dto");
const zod_validation_pipe_1 = require("../../common/pipes/zod-validation.pipe");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let QuizzesController = class QuizzesController {
    constructor(quizzesService) {
        this.quizzesService = quizzesService;
    }
    async findAll(query) {
        return this.quizzesService.findAll(query);
    }
    async findById(id) {
        return this.quizzesService.findById(id);
    }
    async create(dto, user) {
        return this.quizzesService.create(dto, user.uid);
    }
    async update(id, dto) {
        return this.quizzesService.update(id, dto);
    }
    async delete(id) {
        return this.quizzesService.delete(id);
    }
    async submit(quizId, dto, user) {
        return this.quizzesService.submit(quizId, user.uid, dto);
    }
    async getMyAttempts(quizId, user) {
        return this.quizzesService.getAttemptsByUser(user.uid, quizId);
    }
};
exports.QuizzesController = QuizzesController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Lista todas as provas (admin)' }),
    __param(0, (0, common_1.Query)(new zod_validation_pipe_1.ZodValidationPipe(quizzes_dto_1.ListQuizzesSchema))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], QuizzesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Busca prova por ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID da prova' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], QuizzesController.prototype, "findById", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Cria nova prova (admin)' }),
    __param(0, (0, common_1.Body)(new zod_validation_pipe_1.ZodValidationPipe(quizzes_dto_1.CreateQuizSchema))),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], QuizzesController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Atualiza prova (admin)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID da prova' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)(new zod_validation_pipe_1.ZodValidationPipe(quizzes_dto_1.UpdateQuizSchema))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], QuizzesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, common_1.HttpCode)(204),
    (0, swagger_1.ApiOperation)({ summary: 'Remove prova (admin)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID da prova' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], QuizzesController.prototype, "delete", null);
__decorate([
    (0, common_1.Post)(':id/submit'),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'Envia respostas de uma prova (colaborador)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID da prova' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)(new zod_validation_pipe_1.ZodValidationPipe(quizzes_dto_1.SubmitQuizSchema))),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], QuizzesController.prototype, "submit", null);
__decorate([
    (0, common_1.Get)(':id/attempts'),
    (0, swagger_1.ApiOperation)({ summary: 'Lista tentativas do usuário autenticado para uma prova' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID da prova' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], QuizzesController.prototype, "getMyAttempts", null);
exports.QuizzesController = QuizzesController = __decorate([
    (0, swagger_1.ApiTags)('Quizzes'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('quizzes'),
    __metadata("design:paramtypes", [quizzes_service_1.QuizzesService])
], QuizzesController);
//# sourceMappingURL=quizzes.controller.js.map