import CommentRepository from '../../Domains/comments/CommentRepository.js';
import NewComment from '../../Domains/comments/entities/NewComment.js';
import ThreadRepository from '../../Domains/threads/ThreadRepository.js';

export interface AddCommentUseCasePayload {
  content: string;
  threadId: string;
  owner: string;
}

interface AddCommentUseCaseResult {
  id: string;
  content: string;
  owner: string;
}

class AddCommentUseCase {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly threadRepository: ThreadRepository,
  ) {}

  async execute(
    payload: AddCommentUseCasePayload,
  ): Promise<AddCommentUseCaseResult> {
    const { threadId } = payload;
    const isThreadExists =
      await this.threadRepository.verifyThreadExists(threadId);

    if (!isThreadExists) {
      throw new Error('ADD_COMMENT_USE_CASE.THREAD_NOT_FOUND');
    }

    const newComment = new NewComment(payload);
    return this.commentRepository.addComment(newComment);
  }
}

export default AddCommentUseCase;
