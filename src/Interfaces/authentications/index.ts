import { Router } from 'express';
import { Container } from 'instances-container';
import AuthenticationsHandler from './handler.js';
import createAuthenticationRoutes from './routes.js';

export default (container: Container): Router => {
  const authenticationsHandler = new AuthenticationsHandler(container);
  return createAuthenticationRoutes(authenticationsHandler);
};
