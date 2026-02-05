import { Router } from 'express';
import { Container } from 'instances-container';
import ThreadsHandler from './handler.js';
import createThreadsRouter from './routes.js';

export default (container: Container): Router => {
  const threadsHandler = new ThreadsHandler(container);
  return createThreadsRouter(threadsHandler, container);
};
