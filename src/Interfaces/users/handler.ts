import { Request, Response, NextFunction } from 'express';
import { Container } from 'instances-container';
import autoBind from 'auto-bind';
import AddUserUseCase from '../../Applications/use_case/AddUserUseCase.js';

class UsersHandler {
  constructor(private readonly container: Container) {
    autoBind(this);
  }

  async postUserHandler(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const addUserUseCase = this.container.getInstance(
        AddUserUseCase.name,
      ) as AddUserUseCase;
      const addedUser = await addUserUseCase.execute(req.body);

      res.status(201).json({
        status: 'success',
        data: {
          addedUser,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default UsersHandler;
