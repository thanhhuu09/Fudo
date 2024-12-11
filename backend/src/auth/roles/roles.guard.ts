import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/common/enums/role.enum';
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers['authorization'];
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header missing');
    }

    const token = authHeader.split(' ')[1]; // Bearer token
    if (!token) {
      throw new UnauthorizedException('Token missing');
    }

    try {
      const user = this.jwtService.verify(token);
      request.user = user;

      if (
        requiredRoles &&
        !requiredRoles.some((role) => user.roles?.includes(role))
      ) {
        throw new UnauthorizedException('Insufficient permissions');
      }

      // Check owner
      const { id } = request.params;
      if (user.roles.includes('user') && id !== user.sub) {
        throw new UnauthorizedException(
          'You can only access your own resources',
        );
      }
      return true;
    } catch (e) {
      throw new UnauthorizedException('Invalid or expired token' + e);
    }
  }
}
