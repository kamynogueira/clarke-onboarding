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
exports.ProgressService = void 0;
const common_1 = require("@nestjs/common");
const progress_model_1 = require("../../models/progress.model");
const trail_model_1 = require("../../models/trail.model");
const user_model_1 = require("../../models/user.model");
let ProgressService = class ProgressService {
    constructor(progressModel, trailModel, userModel) {
        this.progressModel = progressModel;
        this.trailModel = trailModel;
        this.userModel = userModel;
    }
    async startTrail(userId, dto) {
        const existing = await this.progressModel.getTrailProgress(userId, dto.trailId);
        if (existing)
            return existing;
        return this.progressModel.startTrail(userId, dto.trailId);
    }
    async getMyTrailProgress(userId, trailId) {
        const [progress, items, trailItems] = await Promise.all([
            this.progressModel.getTrailProgress(userId, trailId),
            this.progressModel.getAllItemsProgress(userId, trailId),
            this.trailModel.getItems(trailId),
        ]);
        const completedItems = items.filter((i) => i.status === 'completed').length;
        const totalItems = trailItems.length;
        const percentComplete = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
        return {
            trail: progress ?? {
                userId,
                trailId,
                status: 'not_started',
                currentItemOrder: 0,
            },
            items,
            totalItems,
            completedItems,
            percentComplete,
        };
    }
    async getMyAllProgress(userId) {
        const trailsProgress = await this.progressModel.getAllTrailsProgress(userId);
        return Promise.all(trailsProgress.map((tp) => this.getMyTrailProgress(userId, tp.trailId)));
    }
    async completeItem(userId, dto) {
        const items = await this.trailModel.getItems(dto.trailId);
        const currentItem = items.find((i) => i.id === dto.itemId);
        if (!currentItem) {
            throw new common_1.ForbiddenException('Item não encontrado nesta trilha');
        }
        await this.progressModel.completeItem(userId, dto.trailId, dto.itemId);
        const nextItem = items.find((i) => i.order === currentItem.order + 1);
        if (nextItem) {
            await this.progressModel.updateCurrentItem(userId, dto.trailId, nextItem.order);
        }
        else {
            await this.progressModel.completeTrail(userId, dto.trailId);
        }
    }
    async getUserProgressForAdmin(userId) {
        const [user, trailsProgress] = await Promise.all([
            this.userModel.findById(userId),
            this.progressModel.getAllTrailsProgress(userId),
        ]);
        const trails = await Promise.all(trailsProgress.map(async (tp) => {
            const [trail, items, trailItems] = await Promise.all([
                this.trailModel.findById(tp.trailId),
                this.progressModel.getAllItemsProgress(userId, tp.trailId),
                this.trailModel.getItems(tp.trailId),
            ]);
            const completedItems = items.filter((i) => i.status === 'completed').length;
            const totalItems = trailItems.length;
            const percentComplete = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
            return {
                trailId: tp.trailId,
                trailTitle: trail.title,
                status: tp.status,
                percentComplete,
                startedAt: tp.startedAt,
                completedAt: tp.completedAt,
            };
        }));
        return {
            uid: user.uid,
            name: user.name,
            email: user.email,
            team: user.team,
            position: user.position,
            trails,
        };
    }
    async getAllUsersProgressForTrail(trailId) {
        const [usersProgress, trail] = await Promise.all([
            this.progressModel.getUsersProgressByTrail(trailId),
            this.trailModel.findById(trailId),
        ]);
        const trailItems = await this.trailModel.getItems(trailId);
        return Promise.all(usersProgress.map(async ({ userId, progress }) => {
            const [user, items] = await Promise.all([
                this.userModel.findById(userId),
                this.progressModel.getAllItemsProgress(userId, trailId),
            ]);
            const completedItems = items.filter((i) => i.status === 'completed').length;
            const percentComplete = trailItems.length > 0
                ? Math.round((completedItems / trailItems.length) * 100)
                : 0;
            return {
                user: { uid: user.uid, name: user.name, email: user.email, team: user.team },
                status: progress.status,
                percentComplete,
                startedAt: progress.startedAt,
                completedAt: progress.completedAt,
            };
        }));
    }
};
exports.ProgressService = ProgressService;
exports.ProgressService = ProgressService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [progress_model_1.ProgressModel,
        trail_model_1.TrailModel,
        user_model_1.UserModel])
], ProgressService);
//# sourceMappingURL=progress.service.js.map