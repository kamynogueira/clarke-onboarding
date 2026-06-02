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
exports.QuizzesService = void 0;
const common_1 = require("@nestjs/common");
const quiz_model_1 = require("../../models/quiz.model");
const quiz_attempt_model_1 = require("../../models/quiz-attempt.model");
const progress_model_1 = require("../../models/progress.model");
const trail_model_1 = require("../../models/trail.model");
let QuizzesService = class QuizzesService {
    constructor(quizModel, attemptModel, progressModel, trailModel) {
        this.quizModel = quizModel;
        this.attemptModel = attemptModel;
        this.progressModel = progressModel;
        this.trailModel = trailModel;
    }
    async findAll(filters) {
        const { data, total } = await this.quizModel.findAll(filters);
        return { data, total, limit: filters.limit, offset: filters.offset };
    }
    async findById(id) {
        return this.quizModel.findById(id);
    }
    async create(dto, createdBy) {
        return this.quizModel.create({ ...dto, createdBy });
    }
    async update(id, dto) {
        return this.quizModel.update(id, dto);
    }
    async delete(id) {
        return this.quizModel.delete(id);
    }
    async submit(quizId, userId, dto) {
        const quiz = await this.quizModel.findById(quizId);
        const trail = await this.trailModel.findById(dto.trailId);
        const { score, correctCount } = this.grade(quiz, dto.answers);
        const passed = score >= quiz.passingScore;
        const attempt = await this.attemptModel.create({
            userId,
            quizId,
            trailId: dto.trailId,
            itemId: dto.itemId,
            answers: dto.answers,
            score,
            passed,
            attemptedAt: new Date(),
        });
        let unlockedNextItem = false;
        if (passed) {
            await this.progressModel.completeItem(userId, dto.trailId, dto.itemId);
            const items = await this.trailModel.getItems(dto.trailId);
            const currentItem = items.find((i) => i.id === dto.itemId);
            const nextItem = items.find((i) => i.order === (currentItem?.order ?? -1) + 1);
            if (nextItem) {
                await this.progressModel.updateCurrentItem(userId, dto.trailId, nextItem.order);
                unlockedNextItem = true;
            }
            else {
                const trailScore = this.calculateOverallTrailScore(score, trail.minScoreToAdvance);
                if (trailScore >= trail.minScoreToAdvance) {
                    await this.progressModel.completeTrail(userId, dto.trailId);
                }
            }
        }
        return {
            attempt,
            score,
            passed,
            correctCount,
            totalQuestions: quiz.questions.length,
            unlockedNextItem,
        };
    }
    async getAttemptsByUser(userId, quizId) {
        return this.attemptModel.findByUserAndQuiz(userId, quizId);
    }
    grade(quiz, answers) {
        let correctCount = 0;
        for (const answer of answers) {
            const question = quiz.questions.find((q) => q.id === answer.questionId);
            if (!question)
                continue;
            const correctOption = question.options.find((o) => o.isCorrect);
            if (correctOption?.id === answer.selectedOptionId) {
                correctCount++;
            }
        }
        const score = quiz.questions.length > 0
            ? Math.round((correctCount / quiz.questions.length) * 100)
            : 0;
        return { score, correctCount };
    }
    calculateOverallTrailScore(quizScore, minScore) {
        return quizScore;
    }
};
exports.QuizzesService = QuizzesService;
exports.QuizzesService = QuizzesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [quiz_model_1.QuizModel,
        quiz_attempt_model_1.QuizAttemptModel,
        progress_model_1.ProgressModel,
        trail_model_1.TrailModel])
], QuizzesService);
//# sourceMappingURL=quizzes.service.js.map