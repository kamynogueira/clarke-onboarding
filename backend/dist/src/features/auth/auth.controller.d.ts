import { AuthService } from './auth.service';
import { ChangePasswordDto, LoginDto, RegisterDto } from './dto/auth.dto';
import { DecodedIdToken } from 'firebase-admin/auth';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(dto: LoginDto): Promise<{
        uid: string;
    }>;
    register(dto: RegisterDto): Promise<{
        message: string;
    }>;
    changePassword(dto: ChangePasswordDto, currentUser: DecodedIdToken): Promise<{
        message: string;
    }>;
}
