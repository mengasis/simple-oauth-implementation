import type { Request, Response, NextFunction } from 'express';
import express from 'express';
import { AuthorizationController } from '../controllers/AuthorizationController';
import { JwtMiddleware } from '../middlewares/JwtMiddleware';
import { authConfig } from '../../../config/auth.config';

const jwtMiddleware = new JwtMiddleware(authConfig.jwks.url);
const authorizationController = new AuthorizationController();
const routes = express.Router();

routes.get('/authorize', jwtMiddleware.handle, (req: Request, res: Response, next: NextFunction) => {
  authorizationController.authorize(req, res).catch(next);
});

export default routes;
