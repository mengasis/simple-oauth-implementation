import { Low } from 'lowdb';

import { JSONFile } from 'lowdb/node';
import type { Client } from '../../domain/entities/Client';
import type { Token } from '../../domain/entities/Token';

type Database = {
  clients: Client[];
  tokens: Token[];
};

const dbFilePath = process.env.DB_FILE_PATH || 'db.json';

const defaultData: Database = { clients: [], tokens: [] };
const adapter = new JSONFile<Database>(dbFilePath);
export const db = new Low<Database>(adapter, defaultData);

export const initializeDatabase = async () => {
  await db.read();
  db.data ||= defaultData;
  await db.write();
};
