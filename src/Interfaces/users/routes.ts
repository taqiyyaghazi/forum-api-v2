import express, { Router } from 'express';
import UsersHandler from './handler.js';

const createUsersRouter = (handler: UsersHandler): Router => {
  const router = express.Router();

  router.post('/', handler.postUserHandler);

  return router;
};

export default createUsersRouter;
