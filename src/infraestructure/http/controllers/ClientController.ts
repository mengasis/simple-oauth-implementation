import type { Request, Response } from 'express';
import { Client } from '../../../domain/entities/Client';
import type { LowDBClientStorage } from '../../database/LowDBClientStorage';
import { BadRequestException } from '../../../domain/exceptions/HttpExceptions';

interface RegisterClientBody {
  client_name: string;
  redirect_uris: string[];
  grant_types: string[];
  scopes: string[];
}

export class ClientController {
  constructor(private readonly clientStorage: LowDBClientStorage) {}

  async register(req: Request<unknown, unknown, RegisterClientBody>, res: Response) {
    const { client_name, redirect_uris, grant_types, scopes } = req.body;

    if (!client_name) {
      throw new BadRequestException('The client_name field is required.');
    }

    if (!redirect_uris?.length) {
      throw new BadRequestException(
        'The redirect_uris field is required and must contain at least one valid URI.'
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
      scopes || []
    );

    await this.clientStorage.save(client);

    return res.status(201).json({
      client_id: client.id,
      client_secret: client.secret,
      client_name: client.name,
      redirect_uris: client.redirectUris,
      grant_types: client.grantTypes,
      scopes: client.scopes
    });
  }
} 