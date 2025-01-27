import {
  Router,
  type NextFunction,
  type Request,
  type Response,
} from 'express';
import { TokenController } from '../controllers/TokenController';
import { TokenService } from '../../../application/services/TokenService';
import { LowDBTokenStorage } from '../../database/LowDBTokenStorage';
import { LowDBAuthorizationCodeStorage } from '../../database/LowDBAuthorizationCodeStorage';
import { LowDBClientStorage } from '../../database/LowDBClientStorage';

const tokenController = new TokenController(
  new TokenService(
    new LowDBTokenStorage(),
    new LowDBAuthorizationCodeStorage(),
    new LowDBClientStorage(),
  ),
);

const routes = Router();

routes.post('/token', (req: Request, res: Response, next: NextFunction) => {
  tokenController.exchange(req, res).catch(next);
});

export default routes;
