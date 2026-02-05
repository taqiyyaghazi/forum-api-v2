import { Request, Response, NextFunction } from 'express';
import { Container } from 'instances-container';
import TokenManager from '../../Applications/security/TokenManager.js';
import AuthenticationError from '../../Commons/exceptions/AuthenticationError.js';

const createAuthMiddleware = (container: Container) => {
  return async (
    req: Request,
    _res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        throw new AuthenticationError('Missing authentication');
      }

      const token = authHeader.replace('Bearer ', '');

      if (!token) {
        throw new AuthenticationError('Missing authentication');
      }

      const tokenManager = container.getInstance(
        TokenManager.name,
      ) as TokenManager;

      const payload = await tokenManager.decodePayload(token);

      if (!payload || !payload.id) {
        throw new AuthenticationError('Invalid token');
      }

      req.auth = {
        id: payload.id,
      };

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default createAuthMiddleware;
