import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common'
import * as admin from 'firebase-admin'
import { Firestore } from 'firebase-admin/firestore'
import { Storage } from 'firebase-admin/storage'
import { Auth } from 'firebase-admin/auth'

@Injectable()
export class FirebaseService implements OnApplicationBootstrap {
  private readonly logger = new Logger(FirebaseService.name)
  private app: admin.app.App

  onApplicationBootstrap() {
    if (admin.apps.length > 0) {
      this.app = admin.apps[0]!
      return
    }

    this.app = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    })

    this.logger.log('Firebase Admin SDK inicializado')
  }

  get firestore(): Firestore {
    return this.app.firestore()
  }

  get auth(): Auth {
    return this.app.auth()
  }

  get storage(): Storage {
    return this.app.storage()
  }

  get db(): Firestore {
    return this.firestore
  }
}
