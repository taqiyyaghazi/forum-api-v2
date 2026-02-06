import autoBind from 'auto-bind';
import { Request, Response } from 'express';
import { Container } from 'instances-container';
import AddReplyUseCase from '../../Applications/use_case/AddReplyUseCase.js';
import DeleteReplyUseCase from '../../Applications/use_case/DeleteReplyUseCase.js';

class RepliesHandler {
  constructor(private readonly container: Container) {
    autoBind(this);
  }

  async postReplyHandler(
    req: Request<
      { threadId: string; commentId: string },
      unknown,
      { content: string }
    >,
    res: Response,
  ): Promise<void> {
    const addReplyUseCase = this.container.getInstance(
      AddReplyUseCase.name,
    ) as AddReplyUseCase;

    const { content } = req.body;
    const { threadId, commentId } = req.params;
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

  async deleteReplyHandler(
    req: Request<{ threadId: string; commentId: string; replyId: string }>,
    res: Response,
  ): Promise<void> {
    const deleteReplyUseCase = this.container.getInstance(
      DeleteReplyUseCase.name,
    ) as DeleteReplyUseCase;

    const { threadId, commentId, replyId } = req.params;
    const owner = req.auth?.id as string;

    await deleteReplyUseCase.execute({
      threadId,
      commentId,
      replyId,
      owner,
    });

    res.status(200).json({
      status: 'success',
      message: 'reply berhasil dihapus',
    });
  }
}

export default RepliesHandler;
