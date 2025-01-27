import type { TokenRepository } from '../../domain/repositories/TokenRepository';
import type { AuthorizationCodeRepository } from '../../domain/repositories/AuthorizationCodeRepository';
import type { ClientRepository } from '../../domain/repositories/ClientRepository';
import { Token } from '../../domain/entities/Token';
import {
  BadRequestException,
  UnauthorizedException,
} from '../../domain/exceptions/HttpExceptions';
import {
  generateAccessToken,
  generateRefreshToken,
} from '../../infraestructure/utils/tokenGenerator';

export class TokenService {
  constructor(
    private readonly tokenRepository: TokenRepository,
    private readonly codeRepository: AuthorizationCodeRepository,
    private readonly clientRepository: ClientRepository,
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
      const expectedChallenge = this.generateCodeChallenge(
        codeVerifier,
        authCode.codeChallengeMethod as 'plain' | 'S256',
      );
      if (expectedChallenge !== authCode.codeChallenge) {
        throw new BadRequestException('Invalid code_verifier');
      }
    }

    // Remove the used authorization code
    await this.codeRepository.deleteByCode(code);

    const accessToken = generateAccessToken(clientId, authCode.scopes);
    const refreshToken = generateRefreshToken();

    const token = new Token(
      accessToken,
      refreshToken,
      clientId,
      authCode.scopes,
      3600,
    );
    await this.tokenRepository.save(token);

    return token;
  }

  private generateCodeChallenge(
    verifier: string,
    method: 'plain' | 'S256',
  ): string {
    if (method === 'plain') {
      return verifier;
    }
    // Implement S256 hashing here
    return ''; // Placeholder for actual implementation
  }

  async exchangeRefreshToken(params: {
    refreshToken: string;
    clientId: string;
    clientSecret?: string;
  }): Promise<Token> {
    const { refreshToken, clientId, clientSecret } = params;

    const token = await this.tokenRepository.findByRefreshToken(refreshToken);
    if (!token || token.clientId !== clientId) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const accessToken = generateAccessToken(clientId, token.scopes);
    const newRefreshToken = generateRefreshToken();

    const updatedToken = new Token(
      accessToken,
      newRefreshToken,
      token.clientId,
      token.scopes,
      token.expiresIn,
    );
    await this.tokenRepository.save(updatedToken);

    return updatedToken;
  }

  async clientCredentials(params: {
    clientId: string;
    clientSecret: string;
  }): Promise<Token> {
    const { clientId, clientSecret } = params;

    const client = await this.clientRepository.findById(clientId);
    if (!client || client.secret !== clientSecret) {
      throw new UnauthorizedException('Invalid client credentials');
    }

    const accessToken = generateAccessToken(clientId, client.scopes);
    const refreshToken = generateRefreshToken();

    const token = new Token(
      accessToken,
      refreshToken,
      clientId,
      client.scopes,
      3600,
    );
    await this.tokenRepository.save(token);

    return token;
  }
}
