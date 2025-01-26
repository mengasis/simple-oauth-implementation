import { Router } from 'express';
import { AuthorizationController } from '../controllers/AuthorizationController';
import { JwtMiddleware } from '../middlewares/JwtMiddleware';
import { authConfig } from '../../../config/auth.config';

const jwtMiddleware = new JwtMiddleware(authConfig.jwks.url);
const authorizationController = new AuthorizationController();
const routes = Router();

routes.get('/authorize', jwtMiddleware.handle, (req, res, next) => {
  authorizationController.authorize(req, res).catch(next);
});

export default routes;
