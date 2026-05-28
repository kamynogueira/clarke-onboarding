import { ForbiddenException, Injectable } from '@nestjs/common'
import { ProgressModel, TrailProgress, ItemProgress } from '@models/progress.model'
import { TrailModel } from '@models/trail.model'
import { UserModel } from '@models/user.model'
import { StartTrailDto, CompleteItemDto } from './dto/progress.dto'

export interface UserTrailProgress {
  trail: TrailProgress
  items: ItemProgress[]
  totalItems: number
  completedItems: number
  percentComplete: number
}

export interface AdminUserProgress {
  uid: string
  name: string
  email: string
  team: string
  position: string
  trails: {
    trailId: string
    trailTitle: string
    status: string
    percentComplete: number
    startedAt?: Date
    completedAt?: Date
  }[]
}

@Injectable()
export class ProgressService {
  constructor(
    private readonly progressModel: ProgressModel,
    private readonly trailModel: TrailModel,
    private readonly userModel: UserModel,
  ) {}

  async startTrail(userId: string, dto: StartTrailDto): Promise<TrailProgress> {
    const existing = await this.progressModel.getTrailProgress(userId, dto.trailId)
    if (existing) return existing
    return this.progressModel.startTrail(userId, dto.trailId)
  }

  async getMyTrailProgress(userId: string, trailId: string): Promise<UserTrailProgress> {
    const [progress, items, trailItems] = await Promise.all([
      this.progressModel.getTrailProgress(userId, trailId),
      this.progressModel.getAllItemsProgress(userId, trailId),
      this.trailModel.getItems(trailId),
    ])

    const completedItems = items.filter((i) => i.status === 'completed').length
    const totalItems = trailItems.length
    const percentComplete =
      totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0

    return {
      trail: progress ?? {
        userId,
        trailId,
        status: 'not_started',
        currentItemOrder: 0,
      },
      items,
      totalItems,
      completedItems,
      percentComplete,
    }
  }

  async getMyAllProgress(userId: string): Promise<UserTrailProgress[]> {
    const trailsProgress = await this.progressModel.getAllTrailsProgress(userId)

    return Promise.all(
      trailsProgress.map((tp) => this.getMyTrailProgress(userId, tp.trailId)),
    )
  }

  async completeItem(userId: string, dto: CompleteItemDto): Promise<void> {
    const items = await this.trailModel.getItems(dto.trailId)
    const currentItem = items.find((i) => i.id === dto.itemId)

    if (!currentItem) {
      throw new ForbiddenException('Item não encontrado nesta trilha')
    }

    await this.progressModel.completeItem(userId, dto.trailId, dto.itemId)

    const nextItem = items.find((i) => i.order === currentItem.order + 1)
    if (nextItem) {
      await this.progressModel.updateCurrentItem(userId, dto.trailId, nextItem.order)
    } else {
      await this.progressModel.completeTrail(userId, dto.trailId)
    }
  }

  async getUserProgressForAdmin(userId: string): Promise<AdminUserProgress> {
    const [user, trailsProgress] = await Promise.all([
      this.userModel.findById(userId),
      this.progressModel.getAllTrailsProgress(userId),
    ])

    const trails = await Promise.all(
      trailsProgress.map(async (tp) => {
        const [trail, items, trailItems] = await Promise.all([
          this.trailModel.findById(tp.trailId),
          this.progressModel.getAllItemsProgress(userId, tp.trailId),
          this.trailModel.getItems(tp.trailId),
        ])

        const completedItems = items.filter((i) => i.status === 'completed').length
        const totalItems = trailItems.length
        const percentComplete =
          totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0

        return {
          trailId: tp.trailId,
          trailTitle: trail.title,
          status: tp.status,
          percentComplete,
          startedAt: tp.startedAt,
          completedAt: tp.completedAt,
        }
      }),
    )

    return {
      uid: user.uid,
      name: user.name,
      email: user.email,
      team: user.team,
      position: user.position,
      trails,
    }
  }

  async getAllUsersProgressForTrail(trailId: string) {
    const [usersProgress, trail] = await Promise.all([
      this.progressModel.getUsersProgressByTrail(trailId),
      this.trailModel.findById(trailId),
    ])

    const trailItems = await this.trailModel.getItems(trailId)

    return Promise.all(
      usersProgress.map(async ({ userId, progress }) => {
        const [user, items] = await Promise.all([
          this.userModel.findById(userId),
          this.progressModel.getAllItemsProgress(userId, trailId),
        ])

        const completedItems = items.filter((i) => i.status === 'completed').length
        const percentComplete =
          trailItems.length > 0
            ? Math.round((completedItems / trailItems.length) * 100)
            : 0

        return {
          user: { uid: user.uid, name: user.name, email: user.email, team: user.team },
          status: progress.status,
          percentComplete,
          startedAt: progress.startedAt,
          completedAt: progress.completedAt,
        }
      }),
    )
  }
}
