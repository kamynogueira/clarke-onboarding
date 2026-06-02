import { FirebaseService } from '@core/firebase/firebase.service';
import { UserModel, User } from '@models/user.model';
import { CreateUserDto, UpdateUserDto, ListUsersDto } from './dto/users.dto';
export declare class UsersService {
    private readonly firebase;
    private readonly userModel;
    constructor(firebase: FirebaseService, userModel: UserModel);
    findAll(filters: ListUsersDto): Promise<{
        data: User[];
        total: number;
        limit: number;
        offset: number;
    }>;
    findById(uid: string): Promise<User>;
    create(dto: CreateUserDto): Promise<User>;
    update(uid: string, dto: UpdateUserDto): Promise<User>;
    delete(uid: string): Promise<void>;
    getTeams(): Promise<string[]>;
    getPositions(): Promise<string[]>;
}
