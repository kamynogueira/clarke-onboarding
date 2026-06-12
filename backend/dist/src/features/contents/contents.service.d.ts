import { ContentModel, Content } from '@models/content.model';
import { CreateContentDto, UpdateContentDto, ListContentsDto, ListLibraryContentsDto } from './dto/contents.dto';
export declare class ContentsService {
    private readonly contentModel;
    constructor(contentModel: ContentModel);
    findAll(filters: ListContentsDto): Promise<{
        data: Content[];
        total: number;
        limit: number;
        offset: number;
    }>;
    findForLibrary(filters: ListLibraryContentsDto): Promise<{
        data: Content[];
        total: number;
        limit: number;
        offset: number;
    }>;
    findById(id: string): Promise<Content>;
    create(dto: CreateContentDto, createdBy: string): Promise<Content>;
    update(id: string, dto: UpdateContentDto): Promise<Content>;
    delete(id: string): Promise<void>;
}
