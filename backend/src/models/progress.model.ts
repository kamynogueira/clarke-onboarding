import { Injectable } from '@nestjs/common'
import { FirebaseService } from '@core/firebase/firebase.service'

export type ProgressStatus = 'not_started' | 'in_progress' | 'completed'
export type ItemStatus = 'pending' | 'completed'

export interface TrailProgress {
  userId: string
  trailId: string
  status: ProgressStatus
  currentItemOrder: number
  startedAt?: Date
  completedAt?: Date
}

export interface ItemProgress {
  userId: string
  trailId: string
  itemId: string
  status: ItemStatus
  completedAt?: Date
}

@Injectable()
export class ProgressModel {
  constructor(private readonly firebase: FirebaseService) {}

  private trailRef(userId: string, trailId: string) {
    return this.firebase.db
      .collection('progress')
      .doc(userId)
      .collection('trails')
      .doc(trailId)
  }

  private itemRef(userId: string, trailId: string, itemId: string) {
    return this.trailRef(userId, trailId).collection('items').doc(itemId)
  }

  async getTrailProgress(userId: string, trailId: string): Promise<TrailProgress | null> {
    const doc = await this.trailRef(userId, trailId).get()
    if (!doc.exists) return null
    return { userId, trailId, ...doc.data() } as TrailProgress
  }

  async getAllTrailsProgress(userId: string): Promise<TrailProgress[]> {
    const snap = await this.firebase.db
      .collection('progress')
      .doc(userId)
      .collection('trails')
      .get()
    return snap.docs.map((d) => ({ userId, trailId: d.id, ...d.data() }) as TrailProgress)
  }

  async startTrail(userId: string, trailId: string): Promise<TrailProgress> {
    const progress: Omit<TrailProgress, 'userId' | 'trailId'> = {
      status: 'in_progress',
      currentItemOrder: 0,
      startedAt: new Date(),
    }
    await this.trailRef(userId, trailId).set(progress, { merge: true })
    return { userId, trailId, ...progress }
  }

  async completeTrail(userId: string, trailId: string): Promise<void> {
    await this.trailRef(userId, trailId).update({
      status: 'completed',
      completedAt: new Date(),
    })
  }

  async updateCurrentItem(
    userId: string,
    trailId: string,
    currentItemOrder: number,
  ): Promise<void> {
    await this.trailRef(userId, trailId).update({ currentItemOrder })
  }

  async getItemProgress(
    userId: string,
    trailId: string,
    itemId: string,
  ): Promise<ItemProgress | null> {
    const doc = await this.itemRef(userId, trailId, itemId).get()
    if (!doc.exists) return null
    return { userId, trailId, itemId, ...doc.data() } as ItemProgress
  }

  async getAllItemsProgress(userId: string, trailId: string): Promise<ItemProgress[]> {
    const snap = await this.trailRef(userId, trailId).collection('items').get()
    return snap.docs.map(
      (d) => ({ userId, trailId, itemId: d.id, ...d.data() }) as ItemProgress,
    )
  }

  async completeItem(userId: string, trailId: string, itemId: string): Promise<void> {
    await this.itemRef(userId, trailId, itemId).set({
      status: 'completed',
      completedAt: new Date(),
    })
  }

  async getUsersProgressByTrail(trailId: string): Promise<
    { userId: string; progress: TrailProgress }[]
  > {
    const usersSnap = await this.firebase.db.collection('progress').get()
    const results: { userId: string; progress: TrailProgress }[] = []

    for (const userDoc of usersSnap.docs) {
      const trailDoc = await userDoc.ref.collection('trails').doc(trailId).get()
      if (trailDoc.exists) {
        results.push({
          userId: userDoc.id,
          progress: {
            userId: userDoc.id,
            trailId,
            ...trailDoc.data(),
          } as TrailProgress,
        })
      }
    }

    return results
  }
}
