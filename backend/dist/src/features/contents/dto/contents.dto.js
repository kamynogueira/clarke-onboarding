"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListLibraryContentsSchema = exports.ListContentsSchema = exports.UpdateContentSchema = exports.CreateContentSchema = void 0;
const zod_1 = require("zod");
const BaseContentSchema = zod_1.z.object({
    title: zod_1.z.string().min(2, 'Título deve ter ao menos 2 caracteres'),
    description: zod_1.z.string().min(5, 'Descrição deve ter ao menos 5 caracteres'),
});
exports.CreateContentSchema = zod_1.z
    .discriminatedUnion('type', [
    BaseContentSchema.extend({
        type: zod_1.z.literal('pdf'),
        url: zod_1.z.string().url('URL do PDF inválida'),
    }),
    BaseContentSchema.extend({
        type: zod_1.z.literal('video'),
        youtubeId: zod_1.z.string().min(1, 'ID do YouTube obrigatório'),
    }),
    BaseContentSchema.extend({
        type: zod_1.z.literal('gdoc'),
        url: zod_1.z.string().url('URL do Google Drive inválida'),
    }),
    BaseContentSchema.extend({
        type: zod_1.z.literal('quiz'),
        quizId: zod_1.z.string().min(1, 'quizId obrigatório'),
    }),
    BaseContentSchema.extend({
        type: zod_1.z.literal('link'),
        url: zod_1.z.string().url('URL inválida'),
    }),
]);
exports.UpdateContentSchema = zod_1.z.object({
    title: zod_1.z.string().min(2).optional(),
    description: zod_1.z.string().min(5).optional(),
    url: zod_1.z.string().url().optional(),
    youtubeId: zod_1.z.string().optional(),
    quizId: zod_1.z.string().optional(),
});
exports.ListContentsSchema = zod_1.z.object({
    type: zod_1.z.enum(['pdf', 'video', 'gdoc', 'quiz', 'link']).optional(),
    limit: zod_1.z.coerce.number().min(1).max(100).default(20),
    offset: zod_1.z.coerce.number().min(0).default(0),
});
exports.ListLibraryContentsSchema = zod_1.z.object({
    type: zod_1.z.enum(['pdf', 'video', 'gdoc', 'link']).optional(),
    search: zod_1.z.string().optional(),
    sort: zod_1.z.enum(['newest', 'oldest', 'az', 'za']).default('newest'),
    limit: zod_1.z.coerce.number().min(1).max(100).default(20),
    offset: zod_1.z.coerce.number().min(0).default(0),
});
//# sourceMappingURL=contents.dto.js.map