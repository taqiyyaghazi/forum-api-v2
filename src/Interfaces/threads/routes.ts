import express, { RequestHandler, Router } from 'express';
import ThreadsHandler from './handler.js';

const createThreadsRouter = (
  handler: ThreadsHandler,
  authMiddleware: RequestHandler,
): Router => {
  const router = express.Router();

  router.post('/', authMiddleware, handler.postThreadHandler);
  router.get('/:threadId', handler.getThreadDetailHandler);

  return router;
};

export default createThreadsRouter;
