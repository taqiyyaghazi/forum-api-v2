import { Router } from 'express';
import { Container } from 'instances-container';
import RepliesHandler from './handler.js';
import createRepliesRouter from './routes.js';
import createAuthMiddleware from '../../Infrastructures/http/middlewares/authMiddleware.js';

export default (container: Container): Router => {
  const repliesHandler = new RepliesHandler(container);
  const authMiddleware = createAuthMiddleware(container);
  return createRepliesRouter(repliesHandler, authMiddleware);
};
