import autoBind from 'auto-bind';
import { Request, Response } from 'express';
import { Container } from 'instances-container';
import AddUserUseCase from '../../Applications/use_case/AddUserUseCase.js';

class UsersHandler {
  constructor(private readonly container: Container) {
    autoBind(this);
  }

  async postUserHandler(req: Request, res: Response): Promise<void> {
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
  }
}

export default UsersHandler;
