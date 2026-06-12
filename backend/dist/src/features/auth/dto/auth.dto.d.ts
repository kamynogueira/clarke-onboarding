import { z } from 'zod';
export declare const LoginSchema: z.ZodObject<{
    idToken: z.ZodString;
}, "strip", z.ZodTypeAny, {
    idToken: string;
}, {
    idToken: string;
}>;
export declare const RegisterSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    phone: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    email: string;
    phone: string;
    password: string;
}, {
    name: string;
    email: string;
    phone: string;
    password: string;
}>;
export declare const ChangePasswordSchema: z.ZodObject<{
    newPassword: z.ZodString;
}, "strip", z.ZodTypeAny, {
    newPassword: string;
}, {
    newPassword: string;
}>;
export type LoginDto = z.infer<typeof LoginSchema>;
export type RegisterDto = z.infer<typeof RegisterSchema>;
export type ChangePasswordDto = z.infer<typeof ChangePasswordSchema>;
