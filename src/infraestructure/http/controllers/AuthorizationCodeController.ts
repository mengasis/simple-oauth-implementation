import type { Request, Response } from 'express';
import {
  BadRequestException,
  UnauthorizedException,
} from '../../../domain/exceptions/HttpExceptions';
import type { AuthorizationService } from '../../../application/services/AuthorizationService';
import { LoggerFactory } from '../../logger/LoggerFactory';

interface AuthorizationCodeQuery {
  response_type?: string;
  client_id: string;
  redirect_uri: string;
  scope?: string | string[];
  state: string;
  code_challenge?: string;
  code_challenge_method?: 'plain' | 'S256';
  client_secret?: string;
}

export type AuthorizationCodeRequest = Request<
  unknown,
  unknown,
  unknown,
  AuthorizationCodeQuery
>;

const logger = LoggerFactory.getLogger();

export class AuthorizationCodeController {
  constructor(private readonly authorizationService: AuthorizationService) {}

  async authorize(req: AuthorizationCodeRequest, res: Response) {
    const {
      response_type,
      client_id,
      redirect_uri,
      scope,
      state,
      code_challenge,
      code_challenge_method,
      client_secret,
    } = req.query;

    if (!client_id || !redirect_uri) {
      throw new BadRequestException('Invalid request');
    }

    const scopes = typeof scope === 'string' ? scope.split(' ') : [];
    const userId = req.user?.sub;

    if (!userId) {
      throw new UnauthorizedException('User is not authenticated.');
    }

    if (response_type === 'token') {
      logger.warn(
        'Client attempted to use deprecated token response_type',
        'AuthorizationController',
      );
      throw new BadRequestException(
        'The "token" response_type is deprecated and not supported in this implementation.',
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
      state,
      client_secret, // Pass client secret
      code_challenge as string,
      code_challenge_method as 'plain' | 'S256',
    );

    logger.info(`Redirecting to: ${redirectURL}`);
    res.redirect(redirectURL);
  }
}
