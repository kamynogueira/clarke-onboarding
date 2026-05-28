import { Injectable } from '@nestjs/common'
import { TrailModel, Trail, TrailItem } from '@models/trail.model'
import { UserModel } from '@models/user.model'
import {
  CreateTrailDto,
  UpdateTrailDto,
  AddTrailItemDto,
  ReorderTrailItemsDto,
  ListTrailsDto,
} from './dto/trails.dto'

@Injectable()
export class TrailsService {
  constructor(
    private readonly trailModel: TrailModel,
    private readonly userModel: UserModel,
  ) {}

  async findAll(
    filters: ListTrailsDto,
  ): Promise<{ data: Trail[]; total: number; limit: number; offset: number }> {
    const { data, total } = await this.trailModel.findAll(filters)
    return { data, total, limit: filters.limit, offset: filters.offset }
  }

  async findById(id: string): Promise<Trail> {
    return this.trailModel.findById(id)
  }

  async findByIdWithItems(id: string): Promise<Trail & { items: TrailItem[] }> {
    const [trail, items] = await Promise.all([
      this.trailModel.findById(id),
      this.trailModel.getItems(id),
    ])
    return { ...trail, items }
  }

  async findAssignedToUser(uid: string): Promise<(Trail & { items: TrailItem[] })[]> {
    const user = await this.userModel.findById(uid)
    const trails = await this.trailModel.findAssignedToUser(
      uid,
      user.team,
      user.position,
    )

    return Promise.all(
      trails.map(async (trail) => {
        const items = await this.trailModel.getItems(trail.id)
        return { ...trail, items }
      }),
    )
  }

  async create(dto: CreateTrailDto, createdBy: string): Promise<Trail> {
    return this.trailModel.create({ ...dto, createdBy })
  }

  async update(id: string, dto: UpdateTrailDto): Promise<Trail> {
    return this.trailModel.update(id, dto)
  }

  async delete(id: string): Promise<void> {
    return this.trailModel.delete(id)
  }

  async getItems(trailId: string): Promise<TrailItem[]> {
    return this.trailModel.getItems(trailId)
  }

  async addItem(trailId: string, dto: AddTrailItemDto): Promise<TrailItem> {
    return this.trailModel.addItem(trailId, dto)
  }

  async reorderItems(
    trailId: string,
    dto: ReorderTrailItemsDto,
  ): Promise<void> {
    await Promise.all(
      dto.items.map(({ itemId, order }) =>
        this.trailModel.updateItemOrder(trailId, itemId, order),
      ),
    )
  }

  async removeItem(trailId: string, itemId: string): Promise<void> {
    return this.trailModel.removeItem(trailId, itemId)
  }
}
