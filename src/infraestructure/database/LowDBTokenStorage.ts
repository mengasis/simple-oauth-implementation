import type { TokenRepository } from '../../domain/repositories/TokenRepository';
import type { Token } from '../../domain/entities/Token';
import { db } from './LowDBDatabase';

export class LowDBTokenStorage implements TokenRepository {
  async save(token: Token): Promise<Token> {
    db.data?.tokens.push(token);
    await db.write();
    return token;
  }

  async findByAccessToken(accessToken: string): Promise<Token | null> {
    return (
      db.data?.tokens.find((token) => token.accessToken === accessToken) || null
    );
  }

  async findByRefreshToken(refreshToken: string): Promise<Token | null> {
    return (
      db.data?.tokens.find((token) => token.refreshToken === refreshToken) ||
      null
    );
  }

  async revokeByAccessToken(accessToken: string): Promise<void> {
    if (db.data) {
      db.data.tokens = db.data.tokens.filter(
        (token) => token.accessToken !== accessToken,
      );
      await db.write();
    }
  }
}
