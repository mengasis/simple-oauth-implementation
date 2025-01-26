import type { Request, Response } from 'express';
import { AuthorizationService } from '../../../app/services/AuthorizationService';
import { LowDBClientStorage } from '../../database/LowDBClientStorage';
import { LowDBAuthorizationCodeStorage } from '../../database/LowDBAuthorizationCodeStorage';

interface AuthorizeQuery  {
  response_type?: 'code' | 'token';
  client_id?: string;
  redirect_uri?: string;
  scope?: string;
  state?: string;
}

export type AuthorizeRequest = Request<unknown, unknown, unknown, AuthorizeQuery>;

export class AuthorizationController {
  private authorizationService: AuthorizationService;

  constructor() {
    const clientRepository = new LowDBClientStorage();
    const codeRepository = new LowDBAuthorizationCodeStorage();
    this.authorizationService = new AuthorizationService(
      clientRepository,
      codeRepository,
    );
  }

  async authorize(req: AuthorizeRequest, res: Response) {
    try {
      const { response_type, client_id, redirect_uri, scope, state } = req.query;

      if (!client_id || !redirect_uri || typeof client_id !== 'string' || typeof redirect_uri !== 'string') {
        return res.status(400).json({ error: 'invalid_request' });
      }

      const scopes = typeof scope === 'string' ? scope.split(' ') : [];
      const userId = req.userId;
      
      if (!userId) {
        return res.status(401).json({ error: 'unauthenticated', description: 'User is not authenticated.' });
      }

      if (response_type === 'token') {
        return res.status(400).json({
          error: 'unsupported_response_type',
          description: 'The "token" response_type is deprecated and not supported in this implementation.',
        });
      }

      if (response_type !== 'code') {
        return res.status(400).json({ error: 'unsupported_response_type' });
      }

      if (!state || typeof state !== 'string') {
        return res.status(400).json({ error: 'missing_state', description: 'State parameter is required.' });
      }

      const redirectURL = await this.authorizationService.authorize(client_id, redirect_uri, scopes, userId, state);
      res.redirect(redirectURL);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}
