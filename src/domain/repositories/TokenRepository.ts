import type { Token } from '../entities/Token';

export interface TokenRepository {
  save(token: Token): Promise<Token>;
  findByAccessToken(accessToken: string): Promise<Token | null>;
  findByRefreshToken(refreshToken: string): Promise<Token | null>;
  revokeByAccessToken(accessToken: string): Promise<void>;
}
