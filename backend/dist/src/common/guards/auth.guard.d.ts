import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FirebaseService } from '@core/firebase/firebase.service';
export declare class AuthGuard implements CanActivate {
    private readonly firebase;
    private readonly reflector;
    constructor(firebase: FirebaseService, reflector: Reflector);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private extractToken;
}
