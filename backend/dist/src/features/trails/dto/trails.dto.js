"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListTrailsSchema = exports.ReorderTrailItemsSchema = exports.AddTrailItemSchema = exports.UpdateTrailSchema = exports.CreateTrailSchema = void 0;
const zod_1 = require("zod");
const AssignmentSchema = zod_1.z.object({
    userIds: zod_1.z.array(zod_1.z.string()).default([]),
    teams: zod_1.z.array(zod_1.z.string()).default([]),
    positions: zod_1.z.array(zod_1.z.string()).default([]),
});
exports.CreateTrailSchema = zod_1.z.object({
    title: zod_1.z.string().min(2, 'Título deve ter ao menos 2 caracteres'),
    description: zod_1.z.string().min(10, 'Descrição deve ter ao menos 10 caracteres'),
    thumbnail: zod_1.z.string().url('URL inválida').optional(),
    status: zod_1.z.enum(['draft', 'published']).default('draft'),
    minScoreToAdvance: zod_1.z
        .number()
        .min(0)
        .max(100)
        .default(70)
        .describe('Nota mínima (0-100) para avançar ao próximo item'),
    assignedTo: AssignmentSchema.default({ userIds: [], teams: [], positions: [] }),
});
exports.UpdateTrailSchema = exports.CreateTrailSchema.partial();
exports.AddTrailItemSchema = zod_1.z.object({
    contentId: zod_1.z.string().min(1, 'contentId obrigatório'),
    type: zod_1.z.enum(['pdf', 'video', 'quiz', 'gdoc', 'link']),
    order: zod_1.z.number().int().min(0),
});
exports.ReorderTrailItemsSchema = zod_1.z.object({
    items: zod_1.z.array(zod_1.z.object({
        itemId: zod_1.z.string(),
        order: zod_1.z.number().int().min(0),
    })),
});
exports.ListTrailsSchema = zod_1.z.object({
    status: zod_1.z.enum(['draft', 'published']).optional(),
    limit: zod_1.z.coerce.number().min(1).max(100).default(20),
    offset: zod_1.z.coerce.number().min(0).default(0),
});
//# sourceMappingURL=trails.dto.js.map