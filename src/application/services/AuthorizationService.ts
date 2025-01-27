import type { ClientRepository } from '../../domain/repositories/ClientRepository';
import type { AuthorizationCodeRepository } from '../../domain/repositories/AuthorizationCodeRepository';
import { AuthorizationCode } from '../../domain/entities/AuthorizationCode';
import { BadRequestException, UnauthorizedException } from '../../domain/exceptions/HttpExceptions';

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
    clientSecret?: string,
    codeChallenge?: string,
    codeChallengeMethod?: 'plain' | 'S256'
  ): Promise<string> {
    const client = await this.clientRepository.findById(clientId);
    if (!client) {
      throw new BadRequestException('Client not found');
    }

    // Validate client secret for confidential clients
    if (client.confidential && (!clientSecret || clientSecret !== client.secret)) {
      throw new UnauthorizedException('Invalid client secret');
    }

    // Ensure PKCE parameters are provided for public clients
    if (!client.confidential && (!codeChallenge || !codeChallengeMethod)) {
      throw new BadRequestException('code_challenge and code_challenge_method are required for public clients');
    }

    const code = AuthorizationCode.create(clientId, userId, redirectUri, scopes, codeChallenge, codeChallengeMethod);
    await this.codeRepository.save(code);

    return `${redirectUri}?code=${code.code}&state=${state}`;
  }
}