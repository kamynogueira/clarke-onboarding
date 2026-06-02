"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListUsersSchema = exports.UpdateUserSchema = exports.CreateUserSchema = void 0;
const zod_1 = require("zod");
exports.CreateUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
    email: zod_1.z.string().email('E-mail inválido'),
    password: zod_1.z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
    phone: zod_1.z.string().min(10, 'Telefone inválido'),
    role: zod_1.z.enum(['admin', 'collaborator']),
    position: zod_1.z.string().min(1, 'Cargo obrigatório'),
    team: zod_1.z.string().min(1, 'Time obrigatório'),
    startDate: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data no formato YYYY-MM-DD'),
    twoFactorEnabled: zod_1.z.boolean().default(true),
});
exports.UpdateUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).optional(),
    phone: zod_1.z.string().min(10).optional(),
    role: zod_1.z.enum(['admin', 'collaborator']).optional(),
    position: zod_1.z.string().min(1).optional(),
    team: zod_1.z.string().min(1).optional(),
    startDate: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    twoFactorEnabled: zod_1.z.boolean().optional(),
});
exports.ListUsersSchema = zod_1.z.object({
    role: zod_1.z.enum(['admin', 'collaborator']).optional(),
    team: zod_1.z.string().optional(),
    position: zod_1.z.string().optional(),
    limit: zod_1.z.coerce.number().min(1).max(100).default(20),
    offset: zod_1.z.coerce.number().min(0).default(0),
});
//# sourceMappingURL=users.dto.js.map