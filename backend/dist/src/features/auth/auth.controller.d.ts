import { AuthService } from './auth.service';
import { LoginDto, RequestNew2FADto, Verify2FADto } from './dto/auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(dto: LoginDto): Promise<{
        customToken: string;
        uid: string;
    }>;
    verify2FA(dto: Verify2FADto): Promise<{
        customToken: string;
    }>;
    resend2FA(dto: RequestNew2FADto): Promise<{
        message: string;
    }>;
}
