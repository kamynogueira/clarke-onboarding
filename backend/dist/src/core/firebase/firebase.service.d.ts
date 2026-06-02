import { OnApplicationBootstrap } from '@nestjs/common';
import { Firestore } from 'firebase-admin/firestore';
import { Storage } from 'firebase-admin/storage';
import { Auth } from 'firebase-admin/auth';
export declare class FirebaseService implements OnApplicationBootstrap {
    private readonly logger;
    private app;
    onApplicationBootstrap(): void;
    get firestore(): Firestore;
    get auth(): Auth;
    get storage(): Storage;
    get db(): Firestore;
}
