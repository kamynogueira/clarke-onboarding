import { z } from 'zod';
export declare const CreateContentSchema: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
} & {
    type: z.ZodLiteral<"pdf">;
    url: z.ZodString;
}, "strip", z.ZodTypeAny, {
    description: string;
    type: "pdf";
    url: string;
    title: string;
}, {
    description: string;
    type: "pdf";
    url: string;
    title: string;
}>, z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
} & {
    type: z.ZodLiteral<"video">;
    youtubeId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    description: string;
    type: "video";
    title: string;
    youtubeId: string;
}, {
    description: string;
    type: "video";
    title: string;
    youtubeId: string;
}>, z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
} & {
    type: z.ZodLiteral<"gdoc">;
    url: z.ZodString;
}, "strip", z.ZodTypeAny, {
    description: string;
    type: "gdoc";
    url: string;
    title: string;
}, {
    description: string;
    type: "gdoc";
    url: string;
    title: string;
}>, z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
} & {
    type: z.ZodLiteral<"quiz">;
    quizId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    description: string;
    type: "quiz";
    title: string;
    quizId: string;
}, {
    description: string;
    type: "quiz";
    title: string;
    quizId: string;
}>, z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
} & {
    type: z.ZodLiteral<"link">;
    url: z.ZodString;
}, "strip", z.ZodTypeAny, {
    description: string;
    type: "link";
    url: string;
    title: string;
}, {
    description: string;
    type: "link";
    url: string;
    title: string;
}>]>;
export declare const UpdateContentSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    url: z.ZodOptional<z.ZodString>;
    youtubeId: z.ZodOptional<z.ZodString>;
    quizId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    description?: string | undefined;
    url?: string | undefined;
    title?: string | undefined;
    youtubeId?: string | undefined;
    quizId?: string | undefined;
}, {
    description?: string | undefined;
    url?: string | undefined;
    title?: string | undefined;
    youtubeId?: string | undefined;
    quizId?: string | undefined;
}>;
export declare const ListContentsSchema: z.ZodObject<{
    type: z.ZodOptional<z.ZodEnum<["pdf", "video", "gdoc", "quiz", "link"]>>;
    limit: z.ZodDefault<z.ZodNumber>;
    offset: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    offset: number;
    type?: "link" | "pdf" | "video" | "quiz" | "gdoc" | undefined;
}, {
    type?: "link" | "pdf" | "video" | "quiz" | "gdoc" | undefined;
    limit?: number | undefined;
    offset?: number | undefined;
}>;
export declare const ListLibraryContentsSchema: z.ZodObject<{
    type: z.ZodOptional<z.ZodEnum<["pdf", "video", "gdoc", "link"]>>;
    search: z.ZodOptional<z.ZodString>;
    sort: z.ZodDefault<z.ZodEnum<["newest", "oldest", "az", "za"]>>;
    limit: z.ZodDefault<z.ZodNumber>;
    offset: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    sort: "newest" | "oldest" | "az" | "za";
    limit: number;
    offset: number;
    search?: string | undefined;
    type?: "link" | "pdf" | "video" | "gdoc" | undefined;
}, {
    search?: string | undefined;
    type?: "link" | "pdf" | "video" | "gdoc" | undefined;
    sort?: "newest" | "oldest" | "az" | "za" | undefined;
    limit?: number | undefined;
    offset?: number | undefined;
}>;
export type CreateContentDto = z.infer<typeof CreateContentSchema>;
export type UpdateContentDto = z.infer<typeof UpdateContentSchema>;
export type ListContentsDto = z.infer<typeof ListContentsSchema>;
export type ListLibraryContentsDto = z.infer<typeof ListLibraryContentsSchema>;
