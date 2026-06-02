"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestNew2FASchema = exports.Verify2FASchema = exports.LoginSchema = void 0;
const zod_1 = require("zod");
exports.LoginSchema = zod_1.z.object({
    email: zod_1.z.string().email('E-mail inválido'),
    password: zod_1.z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
});
exports.Verify2FASchema = zod_1.z.object({
    uid: zod_1.z.string().min(1, 'UID obrigatório'),
    code: zod_1.z.string().length(6, 'Código deve ter 6 dígitos'),
});
exports.RequestNew2FASchema = zod_1.z.object({
    uid: zod_1.z.string().min(1, 'UID obrigatório'),
});
//# sourceMappingURL=auth.dto.js.map