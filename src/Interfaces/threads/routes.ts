import express, { Router } from 'express';
import { Container } from 'instances-container';
import createAuthMiddleware from '../middlewares/authMiddleware.js';
import ThreadsHandler from './handler.js';

const createThreadsRouter = (
  handler: ThreadsHandler,
  container: Container,
): Router => {
  const router = express.Router();
  const authMiddleware = createAuthMiddleware(container);

  router.post('/', authMiddleware, handler.postThreadHandler);

  return router;
};

export default createThreadsRouter;
