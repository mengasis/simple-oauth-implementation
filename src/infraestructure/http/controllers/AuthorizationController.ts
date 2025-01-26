import type { Request, Response } from 'express';
import { AuthorizationService } from '../../../app/services/AuthorizationService';
import { LowDBClientStorage } from '../../database/LowDBClientStorage';
import { LowDBAuthorizationCodeStorage } from '../../database/LowDBAuthorizationCodeStorage';
import { BadRequestException, UnauthorizedException } from '../../../domain/exceptions/HttpExceptions';
import { LoggerFactory } from '../../logger/LoggerFactory';

const logger = LoggerFactory.getLogger();

interface AuthorizeQuery {
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
    const { response_type, client_id, redirect_uri, scope, state } = req.query;

    if (!client_id || !redirect_uri || typeof client_id !== 'string' || typeof redirect_uri !== 'string') {
      throw new BadRequestException('invalid_request');
    }

    const scopes = typeof scope === 'string' ? scope.split(' ') : [];
    const userId = req.userId;
    
    if (!userId) {
      throw new UnauthorizedException('User is not authenticated.');
    }

    if (response_type === 'token') {
      logger.warn(
        'Client attempted to use deprecated token response_type',
        'AuthorizationController'
      );
      throw new BadRequestException(
        'The "token" response_type is deprecated and not supported in this implementation.'
      );
    }

    if (response_type !== 'code') {
      throw new BadRequestException('unsupported_response_type');
    }

    if (!state || typeof state !== 'string') {
      throw new BadRequestException('State parameter is required.');
    }

    const redirectURL = await this.authorizationService.authorize(
      client_id,
      redirect_uri,
      scopes,
      userId,
      state
    );
    
    res.redirect(redirectURL);
  }
}
