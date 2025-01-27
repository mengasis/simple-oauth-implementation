import type { Request, Response } from 'express';
import type { TokenService } from '../../../application/services/TokenService';
import { BadRequestException } from '../../../domain/exceptions/HttpExceptions';

export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  async exchange(req: Request, res: Response): Promise<void> {
    const { grant_type, code, redirect_uri, client_id, client_secret, code_verifier } = req.body;

    if (grant_type === 'authorization_code') {
      const token = await this.tokenService.exchangeAuthorizationCode({
        code,
        redirectUri: redirect_uri,
        clientId: client_id,
        clientSecret: client_secret,
        codeVerifier: code_verifier
      });
      res.json({
        access_token: token.accessToken,
        token_type: 'Bearer',
        expires_in: token.expiresIn,
        refresh_token: token.refreshToken // Optional
      });
    } else if (grant_type === 'refresh_token') {
      // Handle refresh token logic here
    } else {
      throw new BadRequestException('Unsupported grant type');
    }
  }
} 