import type { Request, Response, NextFunction } from 'express';
import express from 'express';
import { AuthorizationController } from '../controllers/AuthorizationController';
import { JwtMiddleware } from '../middlewares/JwtMiddleware';
import { authConfig } from '../../../config/auth.config';
import { AuthorizationService } from '../../../application/services/AuthorizationService';
import { LowDBClientStorage } from '../../database/LowDBClientStorage';
import { LowDBAuthorizationCodeStorage } from '../../database/LowDBAuthorizationCodeStorage';

const jwtMiddleware = new JwtMiddleware(authConfig.jwks.url);

const clientRepository = new LowDBClientStorage();
const codeRepository = new LowDBAuthorizationCodeStorage();

const authorizationService = new AuthorizationService(clientRepository, codeRepository);

const authorizationCodeController = new AuthorizationController(authorizationService);
const routes = express.Router();

routes.get('/authorize', jwtMiddleware.handle, (req: Request, res: Response, next: NextFunction) => {
  authorizationCodeController.authorize(req, res).catch(next);
});

export default routes;
