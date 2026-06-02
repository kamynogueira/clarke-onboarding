import { z } from 'zod';
export declare const LoginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const Verify2FASchema: z.ZodObject<{
    uid: z.ZodString;
    code: z.ZodString;
}, "strip", z.ZodTypeAny, {
    uid: string;
    code: string;
}, {
    uid: string;
    code: string;
}>;
export declare const RequestNew2FASchema: z.ZodObject<{
    uid: z.ZodString;
}, "strip", z.ZodTypeAny, {
    uid: string;
}, {
    uid: string;
}>;
export type LoginDto = z.infer<typeof LoginSchema>;
export type Verify2FADto = z.infer<typeof Verify2FASchema>;
export type RequestNew2FADto = z.infer<typeof RequestNew2FASchema>;
