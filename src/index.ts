import express from 'express';
import type { Application } from 'express';
import dotenv from 'dotenv';
import { initializeDatabase } from './infraestructure/database/LowDBDatabase';

dotenv.config();

const app: Application = express();
app.use(express.json());

const PORT = 3000;

(async () => {
  await initializeDatabase();
  app.listen(PORT, () => {
    console.log(`Authorization server running on http://localhost:${PORT}`);
  });
})();
