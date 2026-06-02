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
exports.QuizAttemptModel = void 0;
const common_1 = require("@nestjs/common");
const firebase_service_1 = require("../core/firebase/firebase.service");
let QuizAttemptModel = class QuizAttemptModel {
    constructor(firebase) {
        this.firebase = firebase;
        this.collection = 'quizAttempts';
    }
    async create(input) {
        const ref = this.firebase.db.collection(this.collection).doc();
        await ref.set(input);
        return { id: ref.id, ...input };
    }
    async findByUserAndQuiz(userId, quizId) {
        const snap = await this.firebase.db
            .collection(this.collection)
            .where('userId', '==', userId)
            .where('quizId', '==', quizId)
            .orderBy('attemptedAt', 'desc')
            .get();
        return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    }
    async findByUserAndTrail(userId, trailId) {
        const snap = await this.firebase.db
            .collection(this.collection)
            .where('userId', '==', userId)
            .where('trailId', '==', trailId)
            .orderBy('attemptedAt', 'desc')
            .get();
        return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    }
    async findLastPassedAttempt(userId, quizId) {
        const snap = await this.firebase.db
            .collection(this.collection)
            .where('userId', '==', userId)
            .where('quizId', '==', quizId)
            .where('passed', '==', true)
            .orderBy('attemptedAt', 'desc')
            .limit(1)
            .get();
        if (snap.empty)
            return null;
        const d = snap.docs[0];
        return { id: d.id, ...d.data() };
    }
    async findAllByTrail(trailId) {
        const snap = await this.firebase.db
            .collection(this.collection)
            .where('trailId', '==', trailId)
            .orderBy('attemptedAt', 'desc')
            .get();
        return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    }
};
exports.QuizAttemptModel = QuizAttemptModel;
exports.QuizAttemptModel = QuizAttemptModel = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [firebase_service_1.FirebaseService])
], QuizAttemptModel);
//# sourceMappingURL=quiz-attempt.model.js.map