import { FirebaseService } from '@core/firebase/firebase.service';
import { ContentType } from './trail.model';
export interface Content {
    id: string;
    title: string;
    description: string;
    type: ContentType;
    url?: string;
    youtubeId?: string;
    quizId?: string;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}
export type CreateContentInput = Omit<Content, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateContentInput = Partial<Omit<Content, 'id' | 'createdAt'>>;
export declare class ContentModel {
    private readonly firebase;
    private readonly collection;
    constructor(firebase: FirebaseService);
    findById(id: string): Promise<Content>;
    findAll(filters?: {
        type?: ContentType;
        limit?: number;
        offset?: number;
    }): Promise<{
        data: Content[];
        total: number;
    }>;
    create(input: CreateContentInput): Promise<Content>;
    update(id: string, input: UpdateContentInput): Promise<Content>;
    delete(id: string): Promise<void>;
}
