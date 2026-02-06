import express, { RequestHandler, Router } from 'express';
import RepliesHandler from './handler.js';

const createRepliesRouter = (
  handler: RepliesHandler,
  authMiddleware: RequestHandler,
): Router => {
  const router = express.Router({ mergeParams: true });

  router.post('/', authMiddleware, handler.postReplyHandler);

  return router;
};

export default createRepliesRouter;
