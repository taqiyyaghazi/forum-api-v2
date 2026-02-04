import autoBind from 'auto-bind';
import { NextFunction, Request, Response } from 'express';
import { Container } from 'instances-container';
import LoginUserUseCase from '../../Applications/use_case/LoginUserUseCase.js';
import RefreshAuthenticationUseCase from '../../Applications/use_case/RefreshAuthenticationUseCase.js';
import LogoutUserUseCase from '../../Applications/use_case/LogoutUserUseCase.js';

class AuthenticationsHandler {
  constructor(private readonly container: Container) {
    autoBind(this);
  }

  async postAuthenticationHandler(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const loginUserUseCase = this.container.getInstance(
        LoginUserUseCase.name,
      ) as LoginUserUseCase;
      const data = await loginUserUseCase.execute(req.body);

      res.status(201).json({
        status: 'success',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async putAuthenticationHandler(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const refreshTokenUseCase = this.container.getInstance(
        RefreshAuthenticationUseCase.name,
      ) as RefreshAuthenticationUseCase;
      const data = await refreshTokenUseCase.execute(req.body);

      res.json({
        status: 'success',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteAuthenticationHandler(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const logoutUserUseCase = this.container.getInstance(
        LogoutUserUseCase.name,
      ) as LogoutUserUseCase;
      await logoutUserUseCase.execute(req.body);

      res.json({
        status: 'success',
      });
    } catch (error) {
      next(error);
    }
  }
}

export default AuthenticationsHandler;
