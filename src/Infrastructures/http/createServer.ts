import express, { Application, NextFunction, Request, Response } from 'express';
import { Container } from 'instances-container';
import ClientError from '../../Commons/exceptions/ClientError.js';
import DomainErrorTranslator from '../../Commons/exceptions/DomainErrorTranslator.js';
import users from '../../Interfaces/users/index.js';
import authentications from '../../Interfaces/authentications/index.js';
import threads from '../../Interfaces/threads/index.js';

const createServer = async (container: Container): Promise<Application> => {
  const app = express();

  app.use(express.json());

  app.use('/users', users(container));
  app.use('/authentications', authentications(container));
  app.use('/threads', threads(container));

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
    const translatedError = DomainErrorTranslator.translate(error);

    if (translatedError instanceof ClientError) {
      return res.status(translatedError.statusCode).json({
        status: 'fail',
        message: translatedError.message,
      });
    }

    return res.status(500).json({
      status: 'error',
      message: 'terjadi kegagalan pada server kami',
    });
  });

  app.use((_req: Request, res: Response) => {
    res.status(404).json({
      status: 'fail',
      message: 'Route not found',
    });
  });

  return app;
};

export default createServer;
