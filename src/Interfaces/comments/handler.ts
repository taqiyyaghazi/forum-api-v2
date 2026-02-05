import autoBind from 'auto-bind';
import { Request, Response } from 'express';
import { Container } from 'instances-container';
import AddCommentUseCase from '../../Applications/use_case/AddCommentUseCase.js';

class CommentsHandler {
  constructor(private readonly container: Container) {
    autoBind(this);
  }

  async postCommentHandler(req: Request, res: Response): Promise<void> {
    const addCommentUseCase = this.container.getInstance(
      AddCommentUseCase.name,
    ) as AddCommentUseCase;

    const owner = req.auth?.id as string;
    const { threadId } = req.params;

    const addedComment = await addCommentUseCase.execute({
      ...req.body,
      threadId,
      owner,
    });

    res.status(201).json({
      status: 'success',
      data: {
        addedComment,
      },
    });
  }
}

export default CommentsHandler;
