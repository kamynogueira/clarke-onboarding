import { z } from 'zod';
export declare const CreateUserSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    phone: z.ZodString;
    role: z.ZodEnum<["admin", "collaborator"]>;
    position: z.ZodString;
    team: z.ZodString;
    startDate: z.ZodString;
    twoFactorEnabled: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    name: string;
    email: string;
    phone: string;
    role: "admin" | "collaborator";
    position: string;
    team: string;
    startDate: string;
    twoFactorEnabled: boolean;
    password: string;
}, {
    name: string;
    email: string;
    phone: string;
    role: "admin" | "collaborator";
    position: string;
    team: string;
    startDate: string;
    password: string;
    twoFactorEnabled?: boolean | undefined;
}>;
export declare const UpdateUserSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    role: z.ZodOptional<z.ZodEnum<["admin", "collaborator"]>>;
    position: z.ZodOptional<z.ZodString>;
    team: z.ZodOptional<z.ZodString>;
    startDate: z.ZodOptional<z.ZodString>;
    twoFactorEnabled: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    phone?: string | undefined;
    role?: "admin" | "collaborator" | undefined;
    position?: string | undefined;
    team?: string | undefined;
    startDate?: string | undefined;
    twoFactorEnabled?: boolean | undefined;
}, {
    name?: string | undefined;
    phone?: string | undefined;
    role?: "admin" | "collaborator" | undefined;
    position?: string | undefined;
    team?: string | undefined;
    startDate?: string | undefined;
    twoFactorEnabled?: boolean | undefined;
}>;
export declare const ListUsersSchema: z.ZodObject<{
    role: z.ZodOptional<z.ZodEnum<["admin", "collaborator"]>>;
    team: z.ZodOptional<z.ZodString>;
    position: z.ZodOptional<z.ZodString>;
    limit: z.ZodDefault<z.ZodNumber>;
    offset: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    offset: number;
    limit: number;
    role?: "admin" | "collaborator" | undefined;
    position?: string | undefined;
    team?: string | undefined;
}, {
    role?: "admin" | "collaborator" | undefined;
    position?: string | undefined;
    team?: string | undefined;
    offset?: number | undefined;
    limit?: number | undefined;
}>;
export type CreateUserDto = z.infer<typeof CreateUserSchema>;
export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;
export type ListUsersDto = z.infer<typeof ListUsersSchema>;
