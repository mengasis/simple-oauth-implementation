import type { AuthorizationCodeRepository } from '../../domain/repositories/AuthorizationCodeRepository';
import type { AuthorizationCode } from '../../domain/entities/AuthorizationCode';
import { db } from './LowDBDatabase';

export class LowDBAuthorizationCodeStorage
  implements AuthorizationCodeRepository
{
  async save(code: AuthorizationCode): Promise<void> {
    db.data?.codes.push(code);
    await db.write();
  }

  async findByCode(code: string): Promise<AuthorizationCode | null> {
    return db.data?.codes.find((authCode) => authCode.code === code) || null;
  }

  async deleteByCode(code: string): Promise<void> {
    if (db.data?.codes) {
      db.data.codes = db.data.codes.filter(
        (authCode) => authCode.code !== code,
      );
    }
    await db.write();
  }
}
