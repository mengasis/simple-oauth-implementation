import type { TokenRepository } from '../../domain/repositories/TokenRepository';
import type { AuthorizationCodeRepository } from '../../domain/repositories/AuthorizationCodeRepository';
import type { ClientRepository } from '../../domain/repositories/ClientRepository';
import { Token } from '../../domain/entities/Token';
import { AuthorizationCode } from '../../domain/entities/AuthorizationCode';
import { BadRequestException, UnauthorizedException } from '../../domain/exceptions/HttpExceptions';
import { generateToken } from '../../infraestructure/utils/tokenGenerator';

export class TokenService {
  constructor(
    private readonly tokenRepository: TokenRepository,
    private readonly codeRepository: AuthorizationCodeRepository,
    private readonly clientRepository: ClientRepository
  ) {}

  async exchangeAuthorizationCode(params: {
    code: string;
    redirectUri: string;
    clientId: string;
    clientSecret?: string;
    codeVerifier?: string; // For PKCE
  }): Promise<Token> {
    const { code, redirectUri, clientId, clientSecret, codeVerifier } = params;

    const client = await this.clientRepository.findById(clientId);
    if (!client) {
      throw new UnauthorizedException('Invalid client');
    }

    const authCode = await this.codeRepository.findByCode(code);
    if (!authCode || authCode.redirectUri !== redirectUri) {
      throw new BadRequestException('Invalid authorization code');
    }

    // PKCE validation
    if (authCode.codeChallenge && !codeVerifier) {
      throw new BadRequestException('code_verifier is required for PKCE');
    }

    // Validate code_verifier if PKCE is used
    if (authCode.codeChallenge && codeVerifier) {
      const expectedChallenge = this.generateCodeChallenge(codeVerifier, authCode.codeChallengeMethod as 'plain' | 'S256');
      if (expectedChallenge !== authCode.codeChallenge) {
        throw new BadRequestException('Invalid code_verifier');
      }
    }

    // Remove the used authorization code
    await this.codeRepository.deleteByCode(code);

    // Generate a new access token
    const accessToken = generateToken();
    const refreshToken = generateToken(); // Optionally generate a refresh token

    const token = new Token(accessToken, refreshToken, clientId, authCode.scopes, 3600);
    await this.tokenRepository.save(token);

    return token;
  }

  private generateCodeChallenge(verifier: string, method: 'plain' | 'S256'): string {
    if (method === 'plain') {
      return verifier;
    }
    // Implement S256 hashing here
    return ''; // Placeholder for actual implementation
  }
} 