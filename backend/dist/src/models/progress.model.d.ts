import { FirebaseService } from '@core/firebase/firebase.service';
export type ProgressStatus = 'not_started' | 'in_progress' | 'completed';
export type ItemStatus = 'pending' | 'completed';
export interface TrailProgress {
    userId: string;
    trailId: string;
    status: ProgressStatus;
    currentItemOrder: number;
    startedAt?: Date;
    completedAt?: Date;
}
export interface ItemProgress {
    userId: string;
    trailId: string;
    itemId: string;
    status: ItemStatus;
    completedAt?: Date;
}
export declare class ProgressModel {
    private readonly firebase;
    constructor(firebase: FirebaseService);
    private trailRef;
    private itemRef;
    getTrailProgress(userId: string, trailId: string): Promise<TrailProgress | null>;
    getAllTrailsProgress(userId: string): Promise<TrailProgress[]>;
    startTrail(userId: string, trailId: string): Promise<TrailProgress>;
    completeTrail(userId: string, trailId: string): Promise<void>;
    updateCurrentItem(userId: string, trailId: string, currentItemOrder: number): Promise<void>;
    getItemProgress(userId: string, trailId: string, itemId: string): Promise<ItemProgress | null>;
    getAllItemsProgress(userId: string, trailId: string): Promise<ItemProgress[]>;
    completeItem(userId: string, trailId: string, itemId: string): Promise<void>;
    getUsersProgressByTrail(trailId: string): Promise<{
        userId: string;
        progress: TrailProgress;
    }[]>;
}
