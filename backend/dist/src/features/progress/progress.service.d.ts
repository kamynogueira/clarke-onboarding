import { ProgressModel, TrailProgress, ItemProgress } from '@models/progress.model';
import { TrailModel } from '@models/trail.model';
import { UserModel } from '@models/user.model';
import { StartTrailDto, CompleteItemDto } from './dto/progress.dto';
export interface UserTrailProgress {
    trail: TrailProgress;
    items: ItemProgress[];
    totalItems: number;
    completedItems: number;
    percentComplete: number;
}
export interface AdminUserProgress {
    uid: string;
    name: string;
    email: string;
    team: string;
    position: string;
    trails: {
        trailId: string;
        trailTitle: string;
        status: string;
        percentComplete: number;
        startedAt?: Date;
        completedAt?: Date;
    }[];
}
export declare class ProgressService {
    private readonly progressModel;
    private readonly trailModel;
    private readonly userModel;
    constructor(progressModel: ProgressModel, trailModel: TrailModel, userModel: UserModel);
    startTrail(userId: string, dto: StartTrailDto): Promise<TrailProgress>;
    getMyTrailProgress(userId: string, trailId: string): Promise<UserTrailProgress>;
    getMyAllProgress(userId: string): Promise<UserTrailProgress[]>;
    completeItem(userId: string, dto: CompleteItemDto): Promise<void>;
    getUserProgressForAdmin(userId: string): Promise<AdminUserProgress>;
    getAllUsersProgressForTrail(trailId: string): Promise<{
        user: {
            uid: string;
            name: string;
            email: string;
            team: string;
        };
        status: import("@models/progress.model").ProgressStatus;
        percentComplete: number;
        startedAt: Date | undefined;
        completedAt: Date | undefined;
    }[]>;
}
