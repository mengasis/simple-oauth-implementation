import type { Request, Response, NextFunction } from 'express';
import { createRemoteJWKSet, jwtVerify, decodeProtectedHeader } from 'jose';
import { UnauthorizedException, InternalServerErrorException } from '../../../domain/exceptions/HttpExceptions';
import type { JwtPayload } from '../../../domain/ports/JwtVerifier';

export class JwtMiddleware {
  private readonly remoteJWKSet: ReturnType<typeof createRemoteJWKSet>;

  constructor(jwksUrl: string) {
    this.remoteJWKSet = createRemoteJWKSet(new URL(jwksUrl), {
      cacheMaxAge: 600000 // 10 minutes
    });
  }

  public handle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = this.extractToken(req);
      if (!token) {
        throw new UnauthorizedException('No token provided');
      }

      const payload = await this.verifyToken(token);
      req.user = payload;
      next();
    } catch (error) {
      next(error);
    }
  };

  private extractToken(req: Request): string | null {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.split(' ')[1];
  }

  private async verifyToken(token: string): Promise<JwtPayload> {
    try {
      const { kid } = decodeProtectedHeader(token);
      if (!kid) {
        throw new UnauthorizedException('Token is missing key ID');
      }

      const { payload } = await jwtVerify(token, this.remoteJWKSet, {
        algorithms: ['RS256']
      });

      if (!payload.sub) {
        throw new UnauthorizedException('Token is missing subject');
      }

      return payload as JwtPayload;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Token verification failed');
    }
  }
} 