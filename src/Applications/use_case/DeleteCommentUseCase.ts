import CommentRepository from '../../Domains/comments/CommentRepository.js';
import ThreadRepository from '../../Domains/threads/ThreadRepository.js';
import DeleteComment, {
  DeleteCommentPayload,
} from '../../Domains/comments/entities/DeleteComment.js';

class DeleteCommentUseCase {
  constructor(
    private readonly threadRepository: ThreadRepository,
    private readonly commentRepository: CommentRepository,
  ) {}

  async execute(payload: DeleteCommentPayload): Promise<void> {
    const { threadId, commentId, owner } = new DeleteComment(payload);

    const isThreadExist =
      await this.threadRepository.verifyThreadExists(threadId);
    if (!isThreadExist) {
      throw new Error('DELETE_COMMENT_USE_CASE.THREAD_NOT_FOUND');
    }

    const isCommentExist =
      await this.commentRepository.isCommentExist(commentId);
    if (!isCommentExist) {
      throw new Error('DELETE_COMMENT_USE_CASE.COMMENT_NOT_FOUND');
    }

    const isCommentOwner = await this.commentRepository.verifyCommentOwner(
      commentId,
      owner,
    );
    if (!isCommentOwner) {
      throw new Error('DELETE_COMMENT_USE_CASE.COMMENT_NOT_OWNER');
    }

    await this.commentRepository.deleteComment(commentId);
  }
}

export default DeleteCommentUseCase;
