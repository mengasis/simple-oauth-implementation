import type { JwtPayload } from '../../domain/ports/JwtVerifier';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
} 