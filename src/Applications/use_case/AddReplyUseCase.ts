import CommentRepository from '../../Domains/comments/CommentRepository.js';
import NewReply from '../../Domains/replies/entities/NewReply.js';
import ReplyRepository from '../../Domains/replies/ReplyRepository.js';
import ThreadRepository from '../../Domains/threads/ThreadRepository.js';
import AddedReply from '../../Domains/replies/entities/AddedReply.js';

interface UseCasePayload {
  threadId: string;
  commentId: string;
  content: string;
  owner: string;
}

class AddReplyUseCase {
  constructor(
    private readonly replyRepository: ReplyRepository,
    private readonly commentRepository: CommentRepository,
    private readonly threadRepository: ThreadRepository,
  ) {}

  async execute(useCasePayload: UseCasePayload): Promise<AddedReply> {
    const { threadId, commentId, content, owner } = useCasePayload;
    const newReply = new NewReply({ content });

    const isThreadExist =
      await this.threadRepository.verifyThreadExists(threadId);

    if (!isThreadExist) {
      throw new Error('ADD_REPLY_USE_CASE.THREAD_NOT_FOUND');
    }

    const isCommentExist =
      await this.commentRepository.isCommentExist(commentId);

    if (!isCommentExist) {
      throw new Error('ADD_REPLY_USE_CASE.COMMENT_NOT_FOUND');
    }

    return this.replyRepository.addReply(newReply, commentId, owner);
  }
}

export default AddReplyUseCase;
