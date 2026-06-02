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
exports.ProgressModel = void 0;
const common_1 = require("@nestjs/common");
const firebase_service_1 = require("../core/firebase/firebase.service");
let ProgressModel = class ProgressModel {
    constructor(firebase) {
        this.firebase = firebase;
    }
    trailRef(userId, trailId) {
        return this.firebase.db
            .collection('progress')
            .doc(userId)
            .collection('trails')
            .doc(trailId);
    }
    itemRef(userId, trailId, itemId) {
        return this.trailRef(userId, trailId).collection('items').doc(itemId);
    }
    async getTrailProgress(userId, trailId) {
        const doc = await this.trailRef(userId, trailId).get();
        if (!doc.exists)
            return null;
        return { userId, trailId, ...doc.data() };
    }
    async getAllTrailsProgress(userId) {
        const snap = await this.firebase.db
            .collection('progress')
            .doc(userId)
            .collection('trails')
            .get();
        return snap.docs.map((d) => ({ userId, trailId: d.id, ...d.data() }));
    }
    async startTrail(userId, trailId) {
        const progress = {
            status: 'in_progress',
            currentItemOrder: 0,
            startedAt: new Date(),
        };
        await this.trailRef(userId, trailId).set(progress, { merge: true });
        return { userId, trailId, ...progress };
    }
    async completeTrail(userId, trailId) {
        await this.trailRef(userId, trailId).update({
            status: 'completed',
            completedAt: new Date(),
        });
    }
    async updateCurrentItem(userId, trailId, currentItemOrder) {
        await this.trailRef(userId, trailId).update({ currentItemOrder });
    }
    async getItemProgress(userId, trailId, itemId) {
        const doc = await this.itemRef(userId, trailId, itemId).get();
        if (!doc.exists)
            return null;
        return { userId, trailId, itemId, ...doc.data() };
    }
    async getAllItemsProgress(userId, trailId) {
        const snap = await this.trailRef(userId, trailId).collection('items').get();
        return snap.docs.map((d) => ({ userId, trailId, itemId: d.id, ...d.data() }));
    }
    async completeItem(userId, trailId, itemId) {
        await this.itemRef(userId, trailId, itemId).set({
            status: 'completed',
            completedAt: new Date(),
        });
    }
    async getUsersProgressByTrail(trailId) {
        const usersSnap = await this.firebase.db.collection('progress').get();
        const results = [];
        for (const userDoc of usersSnap.docs) {
            const trailDoc = await userDoc.ref.collection('trails').doc(trailId).get();
            if (trailDoc.exists) {
                results.push({
                    userId: userDoc.id,
                    progress: {
                        userId: userDoc.id,
                        trailId,
                        ...trailDoc.data(),
                    },
                });
            }
        }
        return results;
    }
};
exports.ProgressModel = ProgressModel;
exports.ProgressModel = ProgressModel = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [firebase_service_1.FirebaseService])
], ProgressModel);
//# sourceMappingURL=progress.model.js.map