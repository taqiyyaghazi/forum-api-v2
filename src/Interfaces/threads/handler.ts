import autoBind from 'auto-bind';
import { Request, Response } from 'express';
import { Container } from 'instances-container';
import AddThreadUseCase from '../../Applications/use_case/AddThreadUseCase.js';
import GetThreadDetailUseCase from '../../Applications/use_case/GetThreadDetailUseCase.js';

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

  async getThreadDetailHandler(req: Request, res: Response): Promise<void> {
    const getThreadDetailUseCase = this.container.getInstance(
      GetThreadDetailUseCase.name,
    ) as GetThreadDetailUseCase;

    const { threadId } = req.params;

    const thread = await getThreadDetailUseCase.execute(threadId as string);

    res.status(200).json({
      status: 'success',
      data: {
        thread,
      },
    });
  }
}

export default ThreadsHandler;
