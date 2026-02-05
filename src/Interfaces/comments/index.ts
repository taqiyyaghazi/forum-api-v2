import { Router } from 'express';
import { Container } from 'instances-container';
import CommentsHandler from './handler.js';
import createCommentsRouter from './routes.js';
import createAuthMiddleware from '../../Infrastructures/http/middlewares/authMiddleware.js';

export default (container: Container): Router => {
  const commentsHandler = new CommentsHandler(container);
  const authMiddleware = createAuthMiddleware(container);
  return createCommentsRouter(commentsHandler, authMiddleware);
};
