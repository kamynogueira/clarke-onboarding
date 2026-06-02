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
exports.ContentModel = void 0;
const common_1 = require("@nestjs/common");
const firebase_service_1 = require("../core/firebase/firebase.service");
let ContentModel = class ContentModel {
    constructor(firebase) {
        this.firebase = firebase;
        this.collection = 'contents';
    }
    async findById(id) {
        const doc = await this.firebase.db.collection(this.collection).doc(id).get();
        if (!doc.exists)
            throw new common_1.NotFoundException(`Conteúdo ${id} não encontrado`);
        return { id: doc.id, ...doc.data() };
    }
    async findAll(filters) {
        let query = this.firebase.db
            .collection(this.collection)
            .orderBy('createdAt', 'desc');
        if (filters?.type)
            query = query.where('type', '==', filters.type);
        const total = (await query.count().get()).data().count;
        if (filters?.offset)
            query = query.offset(filters.offset);
        if (filters?.limit)
            query = query.limit(filters.limit);
        const snap = await query.get();
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        return { data, total };
    }
    async create(input) {
        const now = new Date();
        const ref = this.firebase.db.collection(this.collection).doc();
        const content = { ...input, createdAt: now, updatedAt: now };
        await ref.set(content);
        return { id: ref.id, ...content };
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
        await this.firebase.db.collection(this.collection).doc(id).delete();
    }
};
exports.ContentModel = ContentModel;
exports.ContentModel = ContentModel = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [firebase_service_1.FirebaseService])
], ContentModel);
//# sourceMappingURL=content.model.js.map