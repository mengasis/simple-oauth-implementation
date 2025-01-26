import { Router } from 'express';
import { ClientController } from '../controllers/ClientController';
import { LowDBClientStorage } from '../../database/LowDBClientStorage';

const clientController = new ClientController(new LowDBClientStorage());
const routes = Router();

routes.post('/register', (req, res, next) => {
  clientController.register(req, res).catch(next);
});

export default routes; 