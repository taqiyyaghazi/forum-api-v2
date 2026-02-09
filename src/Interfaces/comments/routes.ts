import express, { RequestHandler, Router } from 'express';
import CommentsHandler from './handler.js';

const createCommentsRouter = (
  handler: CommentsHandler,
  authMiddleware: RequestHandler,
): Router => {
  const router = express.Router({ mergeParams: true });

  router.post('/', authMiddleware, handler.postCommentHandler);
  router.delete('/:commentId', authMiddleware, handler.deleteCommentHandler);
  router.put(
    '/:commentId/likes',
    authMiddleware,
    handler.putLikeCommentHandler,
  );

  return router;
};

export default createCommentsRouter;
