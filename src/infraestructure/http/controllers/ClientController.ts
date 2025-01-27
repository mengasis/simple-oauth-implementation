import type { Request, Response } from 'express';
import { Client } from '../../../domain/entities/Client';
import type { LowDBClientStorage } from '../../database/LowDBClientStorage';
import { BadRequestException } from '../../../domain/exceptions/HttpExceptions';
import { LoggerFactory } from '../../logger/LoggerFactory';

interface RegisterClientBody {
  client_name: string;
  redirect_uris: string[];
  grant_types: string[];
  scopes: string[];
  confidential: boolean;
}

const logger = LoggerFactory.getLogger();

export type ClientRequest = Request<unknown, unknown, RegisterClientBody>;

export class ClientController {
  constructor(private readonly clientStorage: LowDBClientStorage) {}

  async register(req: ClientRequest, res: Response) {
    const { client_name, redirect_uris, grant_types, scopes, confidential } =
      req.body;

    logger.info(`Registering new client: ${client_name}`, 'ClientController');

    if (!client_name) {
      throw new BadRequestException('The client_name field is required.');
    }

    if (!redirect_uris?.length) {
      throw new BadRequestException(
        'The redirect_uris field is required and must contain at least one valid URI.',
      );
    }

    if (!grant_types?.length) {
      throw new BadRequestException('The grant_types field is required.');
    }

    // Validate URIs
    for (const uri of redirect_uris) {
      try {
        new URL(uri);
      } catch {
        throw new BadRequestException(`Invalid redirect URI: ${uri}`);
      }
    }

    const client = Client.create(
      client_name,
      redirect_uris,
      grant_types,
      scopes || [],
      confidential,
    );

    await this.clientStorage.save(client);
    logger.info(
      `Client registered successfully: ${client.id}`,
      'ClientController',
    );

    return res.status(201).json({
      client_id: client.id,
      client_secret: client.secret,
      client_name: client.name,
      redirect_uris: client.redirect_uris,
      grant_types: client.grant_types,
      scopes: client.scopes,
      confidential: client.confidential,
    });
  }
}
