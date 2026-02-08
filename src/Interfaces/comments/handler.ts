import autoBind from 'auto-bind';
import { Request, Response } from 'express';
import { Container } from 'instances-container';
import AddCommentUseCase from '../../Applications/use_case/AddCommentUseCase.js';
import DeleteCommentUseCase from '../../Applications/use_case/DeleteCommentUseCase.js';
import ToggleLikeCommentUseCase from '../../Applications/use_case/ToggleLikeCommentUseCase.js';

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

  async deleteCommentHandler(req: Request, res: Response): Promise<void> {
    const deleteCommentUseCase = this.container.getInstance(
      DeleteCommentUseCase.name,
    ) as DeleteCommentUseCase;

    const owner = req.auth?.id as string;
    const threadId = req.params.threadId as string;
    const commentId = req.params.commentId as string;

    const deletedComment = await deleteCommentUseCase.execute({
      threadId,
      commentId,
      owner,
    });

    res.status(200).json({
      status: 'success',
      data: {
        deletedComment,
      },
    });
  }

  async putLikeCommentHandler(req: Request<{ commentId: string; threadId: string }>, res: Response): Promise<void> {
    const toggleLikeCommentUseCase = this.container.getInstance(
      ToggleLikeCommentUseCase.name,
    ) as ToggleLikeCommentUseCase;

    const { commentId, threadId } = req.params;
    const { id: userId } = req.auth!;

    await toggleLikeCommentUseCase.execute({
      threadId,
      commentId,
      userId,
    });

    res.status(200).json({
      status: 'success',
    });
  }
}

export default CommentsHandler;
