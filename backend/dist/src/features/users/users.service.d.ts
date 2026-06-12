import { FirebaseService } from '@core/firebase/firebase.service';
import { UserModel, User } from '@models/user.model';
import { ApproveUserDto, CreateUserDto, ListUsersDto, UpdateMeDto, UpdateUserDto } from './dto/users.dto';
export declare class UsersService {
    private readonly firebase;
    private readonly userModel;
    private readonly logger;
    private readonly transporter;
    constructor(firebase: FirebaseService, userModel: UserModel);
    findAll(filters: ListUsersDto): Promise<{
        data: User[];
        total: number;
        limit: number;
        offset: number;
    }>;
    findById(uid: string): Promise<User>;
    findMe(uid: string): Promise<User>;
    updateMe(uid: string, dto: UpdateMeDto, role: string): Promise<User>;
    create(dto: CreateUserDto): Promise<User>;
    approve(uid: string, dto: ApproveUserDto): Promise<User>;
    reject(uid: string): Promise<void>;
    update(uid: string, dto: UpdateUserDto): Promise<User>;
    delete(uid: string): Promise<void>;
    getTeams(): Promise<string[]>;
    getPositions(): Promise<string[]>;
    private sendApprovalEmail;
    private sendRejectionEmail;
}
