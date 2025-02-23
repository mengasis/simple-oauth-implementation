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

routes.post('/revoke', (req: Request, res: Response, next: NextFunction) => {
  tokenController.revoke(req, res).catch(next);
});

// New introspect route
routes.post(
  '/introspect',
  (req: Request, res: Response, next: NextFunction) => {
    tokenController.introspect(req, res).catch(next);
  },
);

export default routes;
