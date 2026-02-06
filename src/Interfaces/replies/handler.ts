import autoBind from 'auto-bind';
import { Request, Response } from 'express';
import { Container } from 'instances-container';
import AddReplyUseCase from '../../Applications/use_case/AddReplyUseCase.js';

class RepliesHandler {
  constructor(private readonly container: Container) {
    autoBind(this);
  }

  async postReplyHandler(req: Request, res: Response): Promise<void> {
    const addReplyUseCase = this.container.getInstance(
      AddReplyUseCase.name,
    ) as AddReplyUseCase;

    const { content } = req.body;
    const threadId = req.params.threadId as string;
    const commentId = req.params.commentId as string;
    const owner = req.auth?.id as string;

    const addedReply = await addReplyUseCase.execute({
      content,
      threadId,
      commentId,
      owner,
    });

    res.status(201).json({
      status: 'success',
      data: {
        addedReply,
      },
    });
  }
}

export default RepliesHandler;
