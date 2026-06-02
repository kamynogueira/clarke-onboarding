import { UsersService } from './users.service';
import { CreateUserDto, ListUsersDto, UpdateUserDto } from './dto/users.dto';
import { DecodedIdToken } from 'firebase-admin/auth';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(query: ListUsersDto): Promise<{
        data: import("../../models/user.model").User[];
        total: number;
        limit: number;
        offset: number;
    }>;
    getMe(user: DecodedIdToken): Promise<import("../../models/user.model").User>;
    getTeams(): Promise<string[]>;
    getPositions(): Promise<string[]>;
    findById(uid: string): Promise<import("../../models/user.model").User>;
    create(dto: CreateUserDto): Promise<import("../../models/user.model").User>;
    update(uid: string, dto: UpdateUserDto): Promise<import("../../models/user.model").User>;
    delete(uid: string): Promise<void>;
}
