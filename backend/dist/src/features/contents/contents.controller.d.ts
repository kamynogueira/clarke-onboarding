import { ContentsService } from './contents.service';
import { CreateContentDto, ListContentsDto, ListLibraryContentsDto, UpdateContentDto } from './dto/contents.dto';
import { DecodedIdToken } from 'firebase-admin/auth';
export declare class ContentsController {
    private readonly contentsService;
    constructor(contentsService: ContentsService);
    findAll(query: ListContentsDto): Promise<{
        data: import("../../models/content.model").Content[];
        total: number;
        limit: number;
        offset: number;
    }>;
    findForLibrary(query: ListLibraryContentsDto): Promise<{
        data: import("../../models/content.model").Content[];
        total: number;
        limit: number;
        offset: number;
    }>;
    findById(id: string): Promise<import("../../models/content.model").Content>;
    create(dto: CreateContentDto, user: DecodedIdToken): Promise<import("../../models/content.model").Content>;
    update(id: string, dto: UpdateContentDto): Promise<import("../../models/content.model").Content>;
    delete(id: string): Promise<void>;
}
