import express from 'express';
import type { Application } from 'express';
import dotenv from 'dotenv';
import { initializeDatabase } from './infraestructure/database/LowDBDatabase';
import authorizationRoutes from './infraestructure/http/routes/AuthorizationRoutes';
import clientRoutes from './infraestructure/http/routes/ClientRoutes';
import { errorHandler } from './infraestructure/http/middlewares/errorHandler';

dotenv.config();

const app: Application = express();
app.use(express.json());

app.use('/oauth', authorizationRoutes);
app.use('/client', clientRoutes);

app.use(errorHandler);

const PORT = 3000;

(async () => {
  await initializeDatabase();
  app.listen(PORT, () => {
    console.log(`Authorization server running on http://localhost:${PORT}`);
  });
})();
