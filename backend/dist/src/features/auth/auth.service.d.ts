import { FirebaseService } from '@core/firebase/firebase.service';
import { UserModel } from '@models/user.model';
export declare class AuthService {
    private readonly firebase;
    private readonly userModel;
    private readonly logger;
    private readonly transporter;
    constructor(firebase: FirebaseService, userModel: UserModel);
    login(email: string, password: string): Promise<{
        customToken: string;
        uid: string;
    }>;
    send2FACode(uid: string, email: string, name: string): Promise<void>;
    verify2FA(uid: string, code: string): Promise<{
        customToken: string;
    }>;
    setCustomClaims(uid: string, role: string): Promise<void>;
    private generateCode;
}
