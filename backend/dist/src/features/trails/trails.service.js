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
exports.TrailsService = void 0;
const common_1 = require("@nestjs/common");
const trail_model_1 = require("../../models/trail.model");
const user_model_1 = require("../../models/user.model");
let TrailsService = class TrailsService {
    constructor(trailModel, userModel) {
        this.trailModel = trailModel;
        this.userModel = userModel;
    }
    async findAll(filters) {
        const { data, total } = await this.trailModel.findAll(filters);
        return { data, total, limit: filters.limit, offset: filters.offset };
    }
    async findById(id) {
        return this.trailModel.findById(id);
    }
    async findByIdWithItems(id) {
        const [trail, items] = await Promise.all([
            this.trailModel.findById(id),
            this.trailModel.getItems(id),
        ]);
        return { ...trail, items };
    }
    async findAssignedToUser(uid) {
        const user = await this.userModel.findById(uid);
        const trails = await this.trailModel.findAssignedToUser(uid, user.team, user.position);
        return Promise.all(trails.map(async (trail) => {
            const items = await this.trailModel.getItems(trail.id);
            return { ...trail, items };
        }));
    }
    async create(dto, createdBy) {
        return this.trailModel.create({ ...dto, createdBy });
    }
    async update(id, dto) {
        return this.trailModel.update(id, dto);
    }
    async delete(id) {
        return this.trailModel.delete(id);
    }
    async getItems(trailId) {
        return this.trailModel.getItems(trailId);
    }
    async addItem(trailId, dto) {
        return this.trailModel.addItem(trailId, dto);
    }
    async reorderItems(trailId, dto) {
        await Promise.all(dto.items.map(({ itemId, order }) => this.trailModel.updateItemOrder(trailId, itemId, order)));
    }
    async removeItem(trailId, itemId) {
        return this.trailModel.removeItem(trailId, itemId);
    }
};
exports.TrailsService = TrailsService;
exports.TrailsService = TrailsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [trail_model_1.TrailModel,
        user_model_1.UserModel])
], TrailsService);
//# sourceMappingURL=trails.service.js.map