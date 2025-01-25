import { db } from './LowDBDatabase';
import type { Client } from '../../domain/entities/Client';
import type { ClientRepository } from '../../domain/repositories/ClientRepository';

export class LowDBClientStorage implements ClientRepository {
  async findById(id: string): Promise<Client | null> {
    return db.data?.clients.find((client) => client.id === id) || null;
  }

  async save(client: Client): Promise<Client> {
    const index = db.data?.clients.findIndex((c) => c.id === client.id) ?? -1;

    if (index >= 0 && db.data) {
      db.data.clients[index] = client;
    } else {
      db.data?.clients.push(client);
    }

    await db.write();
    return client;
  }
}
