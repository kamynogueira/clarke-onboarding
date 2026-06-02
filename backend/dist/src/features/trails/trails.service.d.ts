import { TrailModel, Trail, TrailItem } from '@models/trail.model';
import { UserModel } from '@models/user.model';
import { CreateTrailDto, UpdateTrailDto, AddTrailItemDto, ReorderTrailItemsDto, ListTrailsDto } from './dto/trails.dto';
export declare class TrailsService {
    private readonly trailModel;
    private readonly userModel;
    constructor(trailModel: TrailModel, userModel: UserModel);
    findAll(filters: ListTrailsDto): Promise<{
        data: Trail[];
        total: number;
        limit: number;
        offset: number;
    }>;
    findById(id: string): Promise<Trail>;
    findByIdWithItems(id: string): Promise<Trail & {
        items: TrailItem[];
    }>;
    findAssignedToUser(uid: string): Promise<(Trail & {
        items: TrailItem[];
    })[]>;
    create(dto: CreateTrailDto, createdBy: string): Promise<Trail>;
    update(id: string, dto: UpdateTrailDto): Promise<Trail>;
    delete(id: string): Promise<void>;
    getItems(trailId: string): Promise<TrailItem[]>;
    addItem(trailId: string, dto: AddTrailItemDto): Promise<TrailItem>;
    reorderItems(trailId: string, dto: ReorderTrailItemsDto): Promise<void>;
    removeItem(trailId: string, itemId: string): Promise<void>;
}
