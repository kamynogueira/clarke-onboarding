import { FirebaseService } from '@core/firebase/firebase.service';
export type TrailStatus = 'draft' | 'published';
export type ContentType = 'pdf' | 'video' | 'quiz' | 'gdoc' | 'link';
export interface TrailAssignment {
    userIds: string[];
    teams: string[];
    positions: string[];
}
export interface Trail {
    id: string;
    title: string;
    description: string;
    thumbnail?: string;
    status: TrailStatus;
    minScoreToAdvance: number;
    assignedTo: TrailAssignment;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface TrailItem {
    id: string;
    trailId: string;
    order: number;
    contentId: string;
    type: ContentType;
}
export type CreateTrailInput = Omit<Trail, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateTrailInput = Partial<Omit<Trail, 'id' | 'createdAt'>>;
export type CreateTrailItemInput = Omit<TrailItem, 'id' | 'trailId'>;
export declare class TrailModel {
    private readonly firebase;
    private readonly collection;
    constructor(firebase: FirebaseService);
    findById(id: string): Promise<Trail>;
    findAll(filters?: {
        status?: TrailStatus;
        limit?: number;
        offset?: number;
    }): Promise<{
        data: Trail[];
        total: number;
    }>;
    findAssignedToUser(userId: string, team: string, position: string): Promise<Trail[]>;
    create(input: CreateTrailInput): Promise<Trail>;
    update(id: string, input: UpdateTrailInput): Promise<Trail>;
    delete(id: string): Promise<void>;
    getItems(trailId: string): Promise<TrailItem[]>;
    addItem(trailId: string, input: CreateTrailItemInput): Promise<TrailItem>;
    updateItemOrder(trailId: string, itemId: string, order: number): Promise<void>;
    removeItem(trailId: string, itemId: string): Promise<void>;
}
