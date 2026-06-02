import { QuizzesService } from './quizzes.service';
import { CreateQuizDto, ListQuizzesDto, SubmitQuizDto, UpdateQuizDto } from './dto/quizzes.dto';
import { DecodedIdToken } from 'firebase-admin/auth';
export declare class QuizzesController {
    private readonly quizzesService;
    constructor(quizzesService: QuizzesService);
    findAll(query: ListQuizzesDto): Promise<{
        data: import("../../models/quiz.model").Quiz[];
        total: number;
        limit: number;
        offset: number;
    }>;
    findById(id: string): Promise<import("../../models/quiz.model").Quiz>;
    create(dto: CreateQuizDto, user: DecodedIdToken): Promise<import("../../models/quiz.model").Quiz>;
    update(id: string, dto: UpdateQuizDto): Promise<import("../../models/quiz.model").Quiz>;
    delete(id: string): Promise<void>;
    submit(quizId: string, dto: SubmitQuizDto, user: DecodedIdToken): Promise<import("./quizzes.service").SubmitResult>;
    getMyAttempts(quizId: string, user: DecodedIdToken): Promise<import("../../models/quiz-attempt.model").QuizAttempt[]>;
}
