import { z } from 'zod';
export declare const StartTrailSchema: z.ZodObject<{
    trailId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    trailId: string;
}, {
    trailId: string;
}>;
export declare const CompleteItemSchema: z.ZodObject<{
    trailId: z.ZodString;
    itemId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    trailId: string;
    itemId: string;
}, {
    trailId: string;
    itemId: string;
}>;
export type StartTrailDto = z.infer<typeof StartTrailSchema>;
export type CompleteItemDto = z.infer<typeof CompleteItemSchema>;
