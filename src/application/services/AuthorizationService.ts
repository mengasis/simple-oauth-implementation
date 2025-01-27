import type { ClientRepository } from '../../domain/repositories/ClientRepository';
import type { AuthorizationCodeRepository } from '../../domain/repositories/AuthorizationCodeRepository';
import { AuthorizationCode } from '../../domain/entities/AuthorizationCode';
import { BadRequestException } from '../../domain/exceptions/HttpExceptions';

export class AuthorizationService {
  constructor(
    private readonly clientRepository: ClientRepository,
    private readonly codeRepository: AuthorizationCodeRepository,
  ) {}

  async authorize(clientId: string, redirectUri: string, scopes: string[], userId: string, state: string): Promise<string> {
    const client = await this.clientRepository.findById(clientId);
    if (!client) {
      throw new BadRequestException('Client not found');
    }

    if (!client.redirect_uris.includes(redirectUri)) {
      throw new BadRequestException('Invalid redirect URI');
    }

    const code = AuthorizationCode.create(clientId, userId, redirectUri, scopes);

    await this.codeRepository.save(code);

    return `${redirectUri}?code=${code.code}&state=${state}`;
  }
} 