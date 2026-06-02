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
exports.UserModel = void 0;
const common_1 = require("@nestjs/common");
const firebase_service_1 = require("../core/firebase/firebase.service");
const firestore_1 = require("firebase-admin/firestore");
let UserModel = class UserModel {
    constructor(firebase) {
        this.firebase = firebase;
        this.collection = 'users';
    }
    async findById(uid) {
        const doc = await this.firebase.db
            .collection(this.collection)
            .doc(uid)
            .get();
        if (!doc.exists)
            throw new common_1.NotFoundException(`Usuário ${uid} não encontrado`);
        return { uid: doc.id, ...doc.data() };
    }
    async findByEmail(email) {
        const snap = await this.firebase.db
            .collection(this.collection)
            .where('email', '==', email)
            .limit(1)
            .get();
        if (snap.empty)
            return null;
        const doc = snap.docs[0];
        return { uid: doc.id, ...doc.data() };
    }
    async findAll(filters) {
        let query = this.firebase.db
            .collection(this.collection)
            .orderBy('createdAt', 'desc');
        if (filters?.role)
            query = query.where('role', '==', filters.role);
        if (filters?.team)
            query = query.where('team', '==', filters.team);
        if (filters?.position)
            query = query.where('position', '==', filters.position);
        const total = (await query.count().get()).data().count;
        if (filters?.offset)
            query = query.offset(filters.offset);
        if (filters?.limit)
            query = query.limit(filters.limit);
        const snap = await query.get();
        const data = snap.docs.map((d) => ({ uid: d.id, ...d.data() }));
        return { data, total };
    }
    async create(uid, input) {
        const now = new Date();
        const user = {
            ...input,
            twoFactorEnabled: input.twoFactorEnabled ?? false,
            twoFactorCode: null,
            twoFactorCodeExpiresAt: null,
            createdAt: now,
            updatedAt: now,
        };
        await this.firebase.db.collection(this.collection).doc(uid).set(user);
        return { uid, ...user };
    }
    async update(uid, input) {
        await this.findById(uid);
        await this.firebase.db
            .collection(this.collection)
            .doc(uid)
            .update({ ...input, updatedAt: new Date() });
        return this.findById(uid);
    }
    async delete(uid) {
        await this.findById(uid);
        await this.firebase.db.collection(this.collection).doc(uid).delete();
    }
    async set2FACode(uid, code, expiresAt) {
        await this.firebase.db.collection(this.collection).doc(uid).update({
            twoFactorCode: code,
            twoFactorCodeExpiresAt: expiresAt,
            updatedAt: new Date(),
        });
    }
    async clear2FACode(uid) {
        await this.firebase.db.collection(this.collection).doc(uid).update({
            twoFactorCode: firestore_1.FieldValue.delete(),
            twoFactorCodeExpiresAt: firestore_1.FieldValue.delete(),
            updatedAt: new Date(),
        });
    }
};
exports.UserModel = UserModel;
exports.UserModel = UserModel = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [firebase_service_1.FirebaseService])
], UserModel);
//# sourceMappingURL=user.model.js.map