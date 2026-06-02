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
exports.ContentsService = void 0;
const common_1 = require("@nestjs/common");
const content_model_1 = require("../../models/content.model");
let ContentsService = class ContentsService {
    constructor(contentModel) {
        this.contentModel = contentModel;
    }
    async findAll(filters) {
        const { data, total } = await this.contentModel.findAll(filters);
        return { data, total, limit: filters.limit, offset: filters.offset };
    }
    async findById(id) {
        return this.contentModel.findById(id);
    }
    async create(dto, createdBy) {
        return this.contentModel.create({ ...dto, createdBy });
    }
    async update(id, dto) {
        return this.contentModel.update(id, dto);
    }
    async delete(id) {
        return this.contentModel.delete(id);
    }
};
exports.ContentsService = ContentsService;
exports.ContentsService = ContentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [content_model_1.ContentModel])
], ContentsService);
//# sourceMappingURL=contents.service.js.map