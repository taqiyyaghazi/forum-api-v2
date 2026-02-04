import express, { Router } from 'express';
import AuthenticationsHandler from './handler.js';

const createAuthenticationRoutes = (
  handler: AuthenticationsHandler,
): Router => {
  const router = express.Router();

  router.post('/', handler.postAuthenticationHandler);
  router.put('/', handler.putAuthenticationHandler);
  router.delete('/', handler.deleteAuthenticationHandler);

  return router;
};

export default createAuthenticationRoutes;
