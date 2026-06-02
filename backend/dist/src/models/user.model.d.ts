import { FirebaseService } from '@core/firebase/firebase.service';
export type UserRole = 'admin' | 'collaborator';
export interface User {
    uid: string;
    name: string;
    email: string;
    phone: string;
    role: UserRole;
    position: string;
    team: string;
    startDate: string;
    twoFactorEnabled: boolean;
    twoFactorCode?: string | null;
    twoFactorCodeExpiresAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
export type CreateUserInput = Omit<User, 'uid' | 'createdAt' | 'updatedAt'>;
export type UpdateUserInput = Partial<Omit<User, 'uid' | 'createdAt'>>;
export declare class UserModel {
    private readonly firebase;
    private readonly collection;
    constructor(firebase: FirebaseService);
    findById(uid: string): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findAll(filters?: {
        role?: UserRole;
        team?: string;
        position?: string;
        limit?: number;
        offset?: number;
    }): Promise<{
        data: User[];
        total: number;
    }>;
    create(uid: string, input: CreateUserInput): Promise<User>;
    update(uid: string, input: UpdateUserInput): Promise<User>;
    delete(uid: string): Promise<void>;
    set2FACode(uid: string, code: string, expiresAt: Date): Promise<void>;
    clear2FACode(uid: string): Promise<void>;
}
