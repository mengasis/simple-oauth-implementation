import { Router } from 'express';
import { AuthorizationController } from '../controllers/AuthorizationController';

const authorizationController = new AuthorizationController();

const routes = Router();

routes.get('/authorize', (req, res, next) => {
  authorizationController.authorize(req, res).catch(next);
});

export default routes;
