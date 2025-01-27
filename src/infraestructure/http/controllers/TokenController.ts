import type { Request, Response } from 'express';
import type { TokenService } from '../../../application/services/TokenService';
import { BadRequestException } from '../../../domain/exceptions/HttpExceptions';

export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  async exchange(req: Request, res: Response): Promise<void> {
    const { grant_type, code, redirect_uri, client_id, client_secret, refresh_token, code_verifier } = req.body;

    if (grant_type === 'authorization_code') {
      const token = await this.tokenService.exchangeAuthorizationCode({
        code,
        redirectUri: redirect_uri,
        clientId: client_id,
        clientSecret: client_secret,
        codeVerifier: code_verifier,
      });
      res.json({
        access_token: token.accessToken,
        token_type: 'Bearer',
        expires_in: token.expiresIn,
        refresh_token: token.refreshToken, // Optional
      });

      return;
    } 
    
    if (grant_type === 'refresh_token') {
      const token = await this.tokenService.exchangeRefreshToken({
        refreshToken: refresh_token,
        clientId: client_id,
      });
      res.json({
        access_token: token.accessToken,
        token_type: 'Bearer',
        expires_in: token.expiresIn,
        refresh_token: token.refreshToken, // Optional
      });
      return;
    } 
    
    if (grant_type === 'client_credentials') {
      const token = await this.tokenService.clientCredentials({
        clientId: client_id,
        clientSecret: client_secret,
      });
      res.json({
        access_token: token.accessToken,
        token_type: 'Bearer',
        expires_in: token.expiresIn,
      });
      return;
    }

    throw new BadRequestException('Unsupported grant type');
  }
} 