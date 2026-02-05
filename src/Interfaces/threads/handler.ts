import autoBind from 'auto-bind';
import { Request, Response } from 'express';
import { Container } from 'instances-container';
import AddThreadUseCase from '../../Applications/use_case/AddThreadUseCase.js';

class ThreadsHandler {
  constructor(private readonly container: Container) {
    autoBind(this);
  }

  async postThreadHandler(req: Request, res: Response): Promise<void> {
    const addThreadUseCase = this.container.getInstance(
      AddThreadUseCase.name,
    ) as AddThreadUseCase;

    const owner = req.auth?.id as string;

    const addedThread = await addThreadUseCase.execute({
      ...req.body,
      owner,
    });

    res.status(201).json({
      status: 'success',
      data: {
        addedThread,
      },
    });
  }
}

export default ThreadsHandler;
