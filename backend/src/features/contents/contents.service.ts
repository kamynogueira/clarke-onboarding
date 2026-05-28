import { Injectable } from '@nestjs/common'
import { ContentModel, Content } from '@models/content.model'
import { CreateContentDto, UpdateContentDto, ListContentsDto } from './dto/contents.dto'

@Injectable()
export class ContentsService {
  constructor(private readonly contentModel: ContentModel) {}

  async findAll(
    filters: ListContentsDto,
  ): Promise<{ data: Content[]; total: number; limit: number; offset: number }> {
    const { data, total } = await this.contentModel.findAll(filters)
    return { data, total, limit: filters.limit, offset: filters.offset }
  }

  async findById(id: string): Promise<Content> {
    return this.contentModel.findById(id)
  }

  async create(dto: CreateContentDto, createdBy: string): Promise<Content> {
    return this.contentModel.create({ ...dto, createdBy })
  }

  async update(id: string, dto: UpdateContentDto): Promise<Content> {
    return this.contentModel.update(id, dto)
  }

  async delete(id: string): Promise<void> {
    return this.contentModel.delete(id)
  }
}
