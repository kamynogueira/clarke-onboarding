import { QuizModel, Quiz } from '@models/quiz.model';
import { QuizAttemptModel, QuizAttempt } from '@models/quiz-attempt.model';
import { ProgressModel } from '@models/progress.model';
import { TrailModel } from '@models/trail.model';
import { CreateQuizDto, UpdateQuizDto, SubmitQuizDto, ListQuizzesDto } from './dto/quizzes.dto';
export interface SubmitResult {
    attempt: QuizAttempt;
    score: number;
    passed: boolean;
    correctCount: number;
    totalQuestions: number;
    unlockedNextItem: boolean;
}
export declare class QuizzesService {
    private readonly quizModel;
    private readonly attemptModel;
    private readonly progressModel;
    private readonly trailModel;
    constructor(quizModel: QuizModel, attemptModel: QuizAttemptModel, progressModel: ProgressModel, trailModel: TrailModel);
    findAll(filters: ListQuizzesDto): Promise<{
        data: Quiz[];
        total: number;
        limit: number;
        offset: number;
    }>;
    findById(id: string): Promise<Quiz>;
    create(dto: CreateQuizDto, createdBy: string): Promise<Quiz>;
    update(id: string, dto: UpdateQuizDto): Promise<Quiz>;
    delete(id: string): Promise<void>;
    submit(quizId: string, userId: string, dto: SubmitQuizDto): Promise<SubmitResult>;
    getAttemptsByUser(userId: string, quizId: string): Promise<QuizAttempt[]>;
    private grade;
    private calculateOverallTrailScore;
}
