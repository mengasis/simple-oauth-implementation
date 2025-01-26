import { Low } from 'lowdb';

import { JSONFile } from 'lowdb/node';
import type { Client } from '../../domain/entities/Client';
import type { Token } from '../../domain/entities/Token';
import type { AuthorizationCode } from '../../domain/entities/AuthorizationCode';

type Database = {
  clients: Client[];
  tokens: Token[];
  codes: AuthorizationCode[];
};

const dbFilePath = process.env.DB_FILE_PATH || 'db.json';

const defaultData: Database = { clients: [], tokens: [], codes: [] };
const adapter = new JSONFile<Database>(dbFilePath);
export const db = new Low<Database>(adapter, defaultData);

export const initializeDatabase = async () => {
  await db.read();
  db.data ||= defaultData;
  await db.write();
};
