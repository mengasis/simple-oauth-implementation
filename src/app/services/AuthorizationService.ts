import { AuthorizationCode } from '../../domain/entities/AuthorizationCode';
import type { AuthorizationCodeRepository } from '../../domain/repositories/AuthorizationCodeRepository';
import type { ClientRepository } from '../../domain/repositories/ClientRepository';

export class AuthorizationService {
  constructor(
    private readonly clientRepository: ClientRepository,
    private readonly codeRepository: AuthorizationCodeRepository,
  ) {}

  async authorize(
    clientId: string,
    redirectUri: string,
    scopes: string[],
    userId: string,
    state: string,
  ): Promise<string> {
    const client = await this.clientRepository.findById(clientId);
    if (!client) {
      throw new Error('Client not found');
    }

    if (!client.redirectUris.includes(redirectUri)) {
      throw new Error('Invalid redirect URI');
    }

    const code = new AuthorizationCode(
      crypto.randomUUID(),
      clientId,
      userId,
      redirectUri,
      scopes,
      Date.now() + 5 * 60 * 1000,
    );

    await this.codeRepository.save(code);

    return `${redirectUri}?code=${code.code}&state=${state}`;
  }
}
