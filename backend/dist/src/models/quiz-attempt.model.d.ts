import { FirebaseService } from '@core/firebase/firebase.service';
export interface QuizAnswer {
    questionId: string;
    selectedOptionId: string;
}
export interface QuizAttempt {
    id: string;
    userId: string;
    quizId: string;
    trailId: string;
    itemId: string;
    answers: QuizAnswer[];
    score: number;
    passed: boolean;
    attemptedAt: Date;
}
export type CreateAttemptInput = Omit<QuizAttempt, 'id'>;
export declare class QuizAttemptModel {
    private readonly firebase;
    private readonly collection;
    constructor(firebase: FirebaseService);
    create(input: CreateAttemptInput): Promise<QuizAttempt>;
    findByUserAndQuiz(userId: string, quizId: string): Promise<QuizAttempt[]>;
    findByUserAndTrail(userId: string, trailId: string): Promise<QuizAttempt[]>;
    findLastPassedAttempt(userId: string, quizId: string): Promise<QuizAttempt | null>;
    findAllByTrail(trailId: string): Promise<QuizAttempt[]>;
}
