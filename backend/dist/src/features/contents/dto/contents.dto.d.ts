import { z } from 'zod';
export declare const CreateContentSchema: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
} & {
    type: z.ZodLiteral<"pdf">;
    url: z.ZodString;
}, "strip", z.ZodTypeAny, {
    description: string;
    url: string;
    type: "pdf";
    title: string;
}, {
    description: string;
    url: string;
    type: "pdf";
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
    url: string;
    type: "gdoc";
    title: string;
}, {
    description: string;
    url: string;
    type: "gdoc";
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
    type: z.ZodOptional<z.ZodEnum<["pdf", "video", "gdoc", "quiz"]>>;
    limit: z.ZodDefault<z.ZodNumber>;
    offset: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    offset: number;
    limit: number;
    type?: "pdf" | "video" | "quiz" | "gdoc" | undefined;
}, {
    offset?: number | undefined;
    limit?: number | undefined;
    type?: "pdf" | "video" | "quiz" | "gdoc" | undefined;
}>;
export type CreateContentDto = z.infer<typeof CreateContentSchema>;
export type UpdateContentDto = z.infer<typeof UpdateContentSchema>;
export type ListContentsDto = z.infer<typeof ListContentsSchema>;
