import {
  Router,
  type NextFunction,
  type Request,
  type Response,
} from 'express';
import { ClientController } from '../controllers/ClientController';
import { LowDBClientStorage } from '../../database/LowDBClientStorage';

const clientController = new ClientController(new LowDBClientStorage());
const routes = Router();

routes.post('/register', (req: Request, res: Response, next: NextFunction) => {
  clientController.register(req, res).catch(next);
});

export default routes;
