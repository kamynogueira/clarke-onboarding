"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangePasswordSchema = exports.RegisterSchema = exports.LoginSchema = void 0;
const zod_1 = require("zod");
exports.LoginSchema = zod_1.z.object({
    idToken: zod_1.z.string().min(1, 'Token obrigatório'),
});
exports.RegisterSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
    email: zod_1.z.string().email('E-mail inválido'),
    password: zod_1.z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
    phone: zod_1.z.string().min(10, 'Telefone inválido'),
});
exports.ChangePasswordSchema = zod_1.z.object({
    newPassword: zod_1.z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
});
//# sourceMappingURL=auth.dto.js.map