"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListQuizzesSchema = exports.SubmitQuizSchema = exports.UpdateQuizSchema = exports.CreateQuizSchema = void 0;
const zod_1 = require("zod");
const OptionSchema = zod_1.z.object({
    id: zod_1.z.string().optional(),
    text: zod_1.z.string().min(1, 'Texto da opção obrigatório'),
    isCorrect: zod_1.z.boolean(),
});
const QuestionSchema = zod_1.z.object({
    id: zod_1.z.string().optional(),
    text: zod_1.z.string().min(5, 'Texto da questão deve ter ao menos 5 caracteres'),
    options: zod_1.z
        .array(OptionSchema)
        .min(2, 'Questão deve ter ao menos 2 opções')
        .refine((opts) => opts.filter((o) => o.isCorrect).length === 1, { message: 'Questão deve ter exatamente 1 opção correta' }),
});
exports.CreateQuizSchema = zod_1.z.object({
    title: zod_1.z.string().min(2, 'Título deve ter ao menos 2 caracteres'),
    passingScore: zod_1.z
        .number()
        .min(0)
        .max(100)
        .default(70)
        .describe('Percentual mínimo para aprovação'),
    questions: zod_1.z.array(QuestionSchema).min(1, 'Prova deve ter ao menos 1 questão'),
});
exports.UpdateQuizSchema = zod_1.z.object({
    title: zod_1.z.string().min(2).optional(),
    passingScore: zod_1.z.number().min(0).max(100).optional(),
    questions: zod_1.z.array(QuestionSchema).min(1).optional(),
});
exports.SubmitQuizSchema = zod_1.z.object({
    trailId: zod_1.z.string().min(1, 'trailId obrigatório'),
    itemId: zod_1.z.string().min(1, 'itemId obrigatório'),
    answers: zod_1.z
        .array(zod_1.z.object({
        questionId: zod_1.z.string().min(1),
        selectedOptionId: zod_1.z.string().min(1),
    }))
        .min(1, 'Respostas obrigatórias'),
});
exports.ListQuizzesSchema = zod_1.z.object({
    limit: zod_1.z.coerce.number().min(1).max(100).default(20),
    offset: zod_1.z.coerce.number().min(0).default(0),
});
//# sourceMappingURL=quizzes.dto.js.map