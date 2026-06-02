import { TrailsService } from './trails.service';
import { AddTrailItemDto, CreateTrailDto, ListTrailsDto, ReorderTrailItemsDto, UpdateTrailDto } from './dto/trails.dto';
import { DecodedIdToken } from 'firebase-admin/auth';
export declare class TrailsController {
    private readonly trailsService;
    constructor(trailsService: TrailsService);
    findAll(query: ListTrailsDto): Promise<{
        data: import("../../models/trail.model").Trail[];
        total: number;
        limit: number;
        offset: number;
    }>;
    findMine(user: DecodedIdToken): Promise<(import("../../models/trail.model").Trail & {
        items: import("../../models/trail.model").TrailItem[];
    })[]>;
    findById(id: string): Promise<import("../../models/trail.model").Trail & {
        items: import("../../models/trail.model").TrailItem[];
    }>;
    create(dto: CreateTrailDto, user: DecodedIdToken): Promise<import("../../models/trail.model").Trail>;
    update(id: string, dto: UpdateTrailDto): Promise<import("../../models/trail.model").Trail>;
    delete(id: string): Promise<void>;
    getItems(id: string): Promise<import("../../models/trail.model").TrailItem[]>;
    addItem(trailId: string, dto: AddTrailItemDto): Promise<import("../../models/trail.model").TrailItem>;
    reorderItems(trailId: string, dto: ReorderTrailItemsDto): Promise<void>;
    removeItem(trailId: string, itemId: string): Promise<void>;
}
