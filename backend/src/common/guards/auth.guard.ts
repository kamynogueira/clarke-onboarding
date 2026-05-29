import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Request } from 'express'
import { FirebaseService } from '@core/firebase/firebase.service'
import { IS_PUBLIC_KEY } from '@common/decorators/public.decorator'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly firebase: FirebaseService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // TODO: remove this block when auth is ready
    const request = context.switchToHttp().getRequest<Request>()
    request['user'] = { uid: 'test-user', role: 'admin', email: 'test@clarke.com.br' }
    return true
  }

  private extractToken(request: Request): string | null {
    const auth = request.headers.authorization
    if (!auth?.startsWith('Bearer ')) return null
    return auth.split(' ')[1]
  }
}
