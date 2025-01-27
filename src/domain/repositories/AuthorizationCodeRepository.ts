import type { AuthorizationCode } from '../entities/AuthorizationCode';

export interface AuthorizationCodeRepository {
  save(code: AuthorizationCode): Promise<void>;
  findByCode(code: string): Promise<AuthorizationCode | null>;
  deleteByCode(code: string): Promise<void>;
}
