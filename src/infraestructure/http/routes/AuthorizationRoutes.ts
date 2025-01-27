import type { Request, Response, NextFunction } from 'express';
import express from 'express';
import { AuthorizationCodeController } from '../controllers/AuthorizationCodeController';
import { JwtMiddleware } from '../middlewares/JwtMiddleware';
import { authConfig } from '../../../config/auth.config';
import { AuthorizationService } from '../../../application/services/AuthorizationService';
import { LowDBClientStorage } from '../../database/LowDBClientStorage';
import { LowDBAuthorizationCodeStorage } from '../../database/LowDBAuthorizationCodeStorage';
import type { AuthorizationCodeRequest } from '../controllers/AuthorizationCodeController';

const jwtMiddleware = new JwtMiddleware(authConfig.jwks.url);

const clientRepository = new LowDBClientStorage();
const codeRepository = new LowDBAuthorizationCodeStorage();

const authorizationService = new AuthorizationService(
  clientRepository,
  codeRepository,
);

const authorizationCodeController = new AuthorizationCodeController(
  authorizationService,
);
const routes = express.Router();

routes.get(
  '/authorize',
  jwtMiddleware.handle,
  (req: AuthorizationCodeRequest, res: Response, next: NextFunction) => {
    authorizationCodeController.authorize(req, res).catch(next);
  },
);

export default routes;
