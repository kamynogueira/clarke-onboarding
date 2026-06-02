import { ProgressService } from './progress.service';
import { CompleteItemDto, StartTrailDto } from './dto/progress.dto';
import { DecodedIdToken } from 'firebase-admin/auth';
export declare class ProgressController {
    private readonly progressService;
    constructor(progressService: ProgressService);
    getMyProgress(user: DecodedIdToken): Promise<import("./progress.service").UserTrailProgress[]>;
    getMyTrailProgress(trailId: string, user: DecodedIdToken): Promise<import("./progress.service").UserTrailProgress>;
    startTrail(dto: StartTrailDto, user: DecodedIdToken): Promise<import("../../models/progress.model").TrailProgress>;
    completeItem(dto: CompleteItemDto, user: DecodedIdToken): Promise<void>;
    getUserProgress(uid: string): Promise<import("./progress.service").AdminUserProgress>;
    getTrailProgress(trailId: string): Promise<{
        user: {
            uid: string;
            name: string;
            email: string;
            team: string;
        };
        status: import("../../models/progress.model").ProgressStatus;
        percentComplete: number;
        startedAt: Date | undefined;
        completedAt: Date | undefined;
    }[]>;
}
