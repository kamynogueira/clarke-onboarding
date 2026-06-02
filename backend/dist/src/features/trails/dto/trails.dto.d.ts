import { z } from 'zod';
export declare const CreateTrailSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
    thumbnail: z.ZodOptional<z.ZodString>;
    status: z.ZodDefault<z.ZodEnum<["draft", "published"]>>;
    minScoreToAdvance: z.ZodDefault<z.ZodNumber>;
    assignedTo: z.ZodDefault<z.ZodObject<{
        userIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        teams: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        positions: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        teams: string[];
        positions: string[];
        userIds: string[];
    }, {
        teams?: string[] | undefined;
        positions?: string[] | undefined;
        userIds?: string[] | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    description: string;
    status: "draft" | "published";
    title: string;
    minScoreToAdvance: number;
    assignedTo: {
        teams: string[];
        positions: string[];
        userIds: string[];
    };
    thumbnail?: string | undefined;
}, {
    description: string;
    title: string;
    status?: "draft" | "published" | undefined;
    thumbnail?: string | undefined;
    minScoreToAdvance?: number | undefined;
    assignedTo?: {
        teams?: string[] | undefined;
        positions?: string[] | undefined;
        userIds?: string[] | undefined;
    } | undefined;
}>;
export declare const UpdateTrailSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    thumbnail: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    status: z.ZodOptional<z.ZodDefault<z.ZodEnum<["draft", "published"]>>>;
    minScoreToAdvance: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    assignedTo: z.ZodOptional<z.ZodDefault<z.ZodObject<{
        userIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        teams: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        positions: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        teams: string[];
        positions: string[];
        userIds: string[];
    }, {
        teams?: string[] | undefined;
        positions?: string[] | undefined;
        userIds?: string[] | undefined;
    }>>>;
}, "strip", z.ZodTypeAny, {
    description?: string | undefined;
    status?: "draft" | "published" | undefined;
    title?: string | undefined;
    thumbnail?: string | undefined;
    minScoreToAdvance?: number | undefined;
    assignedTo?: {
        teams: string[];
        positions: string[];
        userIds: string[];
    } | undefined;
}, {
    description?: string | undefined;
    status?: "draft" | "published" | undefined;
    title?: string | undefined;
    thumbnail?: string | undefined;
    minScoreToAdvance?: number | undefined;
    assignedTo?: {
        teams?: string[] | undefined;
        positions?: string[] | undefined;
        userIds?: string[] | undefined;
    } | undefined;
}>;
export declare const AddTrailItemSchema: z.ZodObject<{
    contentId: z.ZodString;
    type: z.ZodEnum<["pdf", "video", "quiz", "gdoc"]>;
    order: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    type: "pdf" | "video" | "quiz" | "gdoc";
    order: number;
    contentId: string;
}, {
    type: "pdf" | "video" | "quiz" | "gdoc";
    order: number;
    contentId: string;
}>;
export declare const ReorderTrailItemsSchema: z.ZodObject<{
    items: z.ZodArray<z.ZodObject<{
        itemId: z.ZodString;
        order: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        order: number;
        itemId: string;
    }, {
        order: number;
        itemId: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    items: {
        order: number;
        itemId: string;
    }[];
}, {
    items: {
        order: number;
        itemId: string;
    }[];
}>;
export declare const ListTrailsSchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<["draft", "published"]>>;
    limit: z.ZodDefault<z.ZodNumber>;
    offset: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    offset: number;
    limit: number;
    status?: "draft" | "published" | undefined;
}, {
    offset?: number | undefined;
    limit?: number | undefined;
    status?: "draft" | "published" | undefined;
}>;
export type CreateTrailDto = z.infer<typeof CreateTrailSchema>;
export type UpdateTrailDto = z.infer<typeof UpdateTrailSchema>;
export type AddTrailItemDto = z.infer<typeof AddTrailItemSchema>;
export type ReorderTrailItemsDto = z.infer<typeof ReorderTrailItemsSchema>;
export type ListTrailsDto = z.infer<typeof ListTrailsSchema>;
