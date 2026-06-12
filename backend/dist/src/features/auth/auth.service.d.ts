import { FirebaseService } from '@core/firebase/firebase.service';
import { UserModel } from '@models/user.model';
import { RegisterDto } from './dto/auth.dto';
export declare class AuthService {
    private readonly firebase;
    private readonly userModel;
    private readonly logger;
    constructor(firebase: FirebaseService, userModel: UserModel);
    login(idToken: string): Promise<{
        uid: string;
    }>;
    register(dto: RegisterDto): Promise<void>;
    changePassword(uid: string, newPassword: string): Promise<void>;
    setCustomClaims(uid: string, role: string): Promise<void>;
}
