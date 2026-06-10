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
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (isPublic) return true

    const request = context.switchToHttp().getRequest<Request>()
    const token = this.extractToken(request)
    if (!token) throw new UnauthorizedException('Token não fornecido')

    try {
      const decoded = await this.firebase.auth.verifyIdToken(token)
      request['user'] = {
        uid: decoded.uid,
        email: decoded.email ?? '',
        role: decoded['role'] ?? 'collaborator',
      }
      return true
    } catch {
      throw new UnauthorizedException('Token inválido ou expirado')
    }
  }

  private extractToken(request: Request): string | null {
    const auth = request.headers.authorization
    if (!auth?.startsWith('Bearer ')) return null
    return auth.split(' ')[1]
  }
}
