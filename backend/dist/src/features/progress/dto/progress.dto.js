"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompleteItemSchema = exports.StartTrailSchema = void 0;
const zod_1 = require("zod");
exports.StartTrailSchema = zod_1.z.object({
    trailId: zod_1.z.string().min(1, 'trailId obrigatório'),
});
exports.CompleteItemSchema = zod_1.z.object({
    trailId: zod_1.z.string().min(1, 'trailId obrigatório'),
    itemId: zod_1.z.string().min(1, 'itemId obrigatório'),
});
//# sourceMappingURL=progress.dto.js.map