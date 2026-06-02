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
exports.TrailModel = void 0;
const common_1 = require("@nestjs/common");
const firebase_service_1 = require("../core/firebase/firebase.service");
let TrailModel = class TrailModel {
    constructor(firebase) {
        this.firebase = firebase;
        this.collection = 'trails';
    }
    async findById(id) {
        const doc = await this.firebase.db.collection(this.collection).doc(id).get();
        if (!doc.exists)
            throw new common_1.NotFoundException(`Trilha ${id} não encontrada`);
        return { id: doc.id, ...doc.data() };
    }
    async findAll(filters) {
        let query = this.firebase.db
            .collection(this.collection)
            .orderBy('createdAt', 'desc');
        if (filters?.status)
            query = query.where('status', '==', filters.status);
        const total = (await query.count().get()).data().count;
        if (filters?.offset)
            query = query.offset(filters.offset);
        if (filters?.limit)
            query = query.limit(filters.limit);
        const snap = await query.get();
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        return { data, total };
    }
    async findAssignedToUser(userId, team, position) {
        const snap = await this.firebase.db
            .collection(this.collection)
            .where('status', '==', 'published')
            .get();
        return snap.docs
            .map((d) => ({ id: d.id, ...d.data() }))
            .filter((trail) => {
            const { userIds, teams, positions } = trail.assignedTo;
            return (userIds.includes(userId) ||
                teams.includes(team) ||
                positions.includes(position));
        });
    }
    async create(input) {
        const now = new Date();
        const ref = this.firebase.db.collection(this.collection).doc();
        const trail = { ...input, createdAt: now, updatedAt: now };
        await ref.set(trail);
        return { id: ref.id, ...trail };
    }
    async update(id, input) {
        await this.findById(id);
        await this.firebase.db
            .collection(this.collection)
            .doc(id)
            .update({ ...input, updatedAt: new Date() });
        return this.findById(id);
    }
    async delete(id) {
        await this.findById(id);
        const batch = this.firebase.db.batch();
        const itemsSnap = await this.firebase.db
            .collection(this.collection)
            .doc(id)
            .collection('items')
            .get();
        itemsSnap.docs.forEach((d) => batch.delete(d.ref));
        batch.delete(this.firebase.db.collection(this.collection).doc(id));
        await batch.commit();
    }
    async getItems(trailId) {
        const snap = await this.firebase.db
            .collection(this.collection)
            .doc(trailId)
            .collection('items')
            .orderBy('order', 'asc')
            .get();
        return snap.docs.map((d) => ({ id: d.id, trailId, ...d.data() }));
    }
    async addItem(trailId, input) {
        await this.findById(trailId);
        const ref = this.firebase.db
            .collection(this.collection)
            .doc(trailId)
            .collection('items')
            .doc();
        await ref.set(input);
        return { id: ref.id, trailId, ...input };
    }
    async updateItemOrder(trailId, itemId, order) {
        await this.firebase.db
            .collection(this.collection)
            .doc(trailId)
            .collection('items')
            .doc(itemId)
            .update({ order });
    }
    async removeItem(trailId, itemId) {
        await this.firebase.db
            .collection(this.collection)
            .doc(trailId)
            .collection('items')
            .doc(itemId)
            .delete();
    }
};
exports.TrailModel = TrailModel;
exports.TrailModel = TrailModel = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [firebase_service_1.FirebaseService])
], TrailModel);
//# sourceMappingURL=trail.model.js.map