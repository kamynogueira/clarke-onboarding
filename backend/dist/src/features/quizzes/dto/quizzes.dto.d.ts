import { z } from 'zod';
export declare const CreateQuizSchema: z.ZodObject<{
    title: z.ZodString;
    passingScore: z.ZodDefault<z.ZodNumber>;
    questions: z.ZodArray<z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        text: z.ZodString;
        options: z.ZodEffects<z.ZodArray<z.ZodObject<{
            id: z.ZodOptional<z.ZodString>;
            text: z.ZodString;
            isCorrect: z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            text: string;
            isCorrect: boolean;
            id?: string | undefined;
        }, {
            text: string;
            isCorrect: boolean;
            id?: string | undefined;
        }>, "many">, {
            text: string;
            isCorrect: boolean;
            id?: string | undefined;
        }[], {
            text: string;
            isCorrect: boolean;
            id?: string | undefined;
        }[]>;
    }, "strip", z.ZodTypeAny, {
        options: {
            text: string;
            isCorrect: boolean;
            id?: string | undefined;
        }[];
        text: string;
        id?: string | undefined;
    }, {
        options: {
            text: string;
            isCorrect: boolean;
            id?: string | undefined;
        }[];
        text: string;
        id?: string | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    title: string;
    questions: {
        options: {
            text: string;
            isCorrect: boolean;
            id?: string | undefined;
        }[];
        text: string;
        id?: string | undefined;
    }[];
    passingScore: number;
}, {
    title: string;
    questions: {
        options: {
            text: string;
            isCorrect: boolean;
            id?: string | undefined;
        }[];
        text: string;
        id?: string | undefined;
    }[];
    passingScore?: number | undefined;
}>;
export declare const UpdateQuizSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    passingScore: z.ZodOptional<z.ZodNumber>;
    questions: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        text: z.ZodString;
        options: z.ZodEffects<z.ZodArray<z.ZodObject<{
            id: z.ZodOptional<z.ZodString>;
            text: z.ZodString;
            isCorrect: z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            text: string;
            isCorrect: boolean;
            id?: string | undefined;
        }, {
            text: string;
            isCorrect: boolean;
            id?: string | undefined;
        }>, "many">, {
            text: string;
            isCorrect: boolean;
            id?: string | undefined;
        }[], {
            text: string;
            isCorrect: boolean;
            id?: string | undefined;
        }[]>;
    }, "strip", z.ZodTypeAny, {
        options: {
            text: string;
            isCorrect: boolean;
            id?: string | undefined;
        }[];
        text: string;
        id?: string | undefined;
    }, {
        options: {
            text: string;
            isCorrect: boolean;
            id?: string | undefined;
        }[];
        text: string;
        id?: string | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    title?: string | undefined;
    questions?: {
        options: {
            text: string;
            isCorrect: boolean;
            id?: string | undefined;
        }[];
        text: string;
        id?: string | undefined;
    }[] | undefined;
    passingScore?: number | undefined;
}, {
    title?: string | undefined;
    questions?: {
        options: {
            text: string;
            isCorrect: boolean;
            id?: string | undefined;
        }[];
        text: string;
        id?: string | undefined;
    }[] | undefined;
    passingScore?: number | undefined;
}>;
export declare const SubmitQuizSchema: z.ZodObject<{
    trailId: z.ZodString;
    itemId: z.ZodString;
    answers: z.ZodArray<z.ZodObject<{
        questionId: z.ZodString;
        selectedOptionId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        questionId: string;
        selectedOptionId: string;
    }, {
        questionId: string;
        selectedOptionId: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    trailId: string;
    itemId: string;
    answers: {
        questionId: string;
        selectedOptionId: string;
    }[];
}, {
    trailId: string;
    itemId: string;
    answers: {
        questionId: string;
        selectedOptionId: string;
    }[];
}>;
export declare const ListQuizzesSchema: z.ZodObject<{
    limit: z.ZodDefault<z.ZodNumber>;
    offset: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    offset: number;
}, {
    limit?: number | undefined;
    offset?: number | undefined;
}>;
export type CreateQuizDto = z.infer<typeof CreateQuizSchema>;
export type UpdateQuizDto = z.infer<typeof UpdateQuizSchema>;
export type SubmitQuizDto = z.infer<typeof SubmitQuizSchema>;
export type ListQuizzesDto = z.infer<typeof ListQuizzesSchema>;
