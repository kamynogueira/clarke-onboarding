import { FirebaseService } from '@core/firebase/firebase.service';
export interface QuizOption {
    id: string;
    text: string;
    isCorrect: boolean;
}
export interface QuizQuestion {
    id: string;
    text: string;
    options: QuizOption[];
}
export interface Quiz {
    id: string;
    title: string;
    passingScore: number;
    questions: QuizQuestion[];
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}
interface QuizOptionInput {
    id?: string;
    text: string;
    isCorrect: boolean;
}
interface QuizQuestionInput {
    id?: string;
    text: string;
    options: QuizOptionInput[];
}
export type CreateQuizInput = Omit<Quiz, 'id' | 'createdAt' | 'updatedAt' | 'questions'> & {
    questions: QuizQuestionInput[];
};
export type UpdateQuizInput = Partial<Omit<Quiz, 'id' | 'createdAt' | 'questions'>> & {
    questions?: QuizQuestionInput[];
};
export declare class QuizModel {
    private readonly firebase;
    private readonly collection;
    constructor(firebase: FirebaseService);
    findById(id: string): Promise<Quiz>;
    findAll(filters?: {
        limit?: number;
        offset?: number;
    }): Promise<{
        data: Quiz[];
        total: number;
    }>;
    create(input: CreateQuizInput): Promise<Quiz>;
    update(id: string, input: UpdateQuizInput): Promise<Quiz>;
    delete(id: string): Promise<void>;
}
export {};
