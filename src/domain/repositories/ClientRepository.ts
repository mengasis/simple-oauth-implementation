import type { Client } from '../entities/Client';

export interface ClientRepository {
  findById(id: string): Promise<Client | null>;
  save(client: Client): Promise<Client>;
}
