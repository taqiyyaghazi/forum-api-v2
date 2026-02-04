import { Router } from 'express';
import { Container } from 'instances-container';
import UsersHandler from './handler.js';
import createUsersRouter from './routes.js';

export default (container: Container): Router => {
  const usersHandler = new UsersHandler(container);
  return createUsersRouter(usersHandler);
};
