import DeleteReply from '../../Domains/replies/entities/DeleteReply.js';
import ReplyRepository from '../../Domains/replies/ReplyRepository.js';

interface DeleteReplyPayload {
  threadId: string;
  commentId: string;
  replyId: string;
  owner: string;
}

class DeleteReplyUseCase {
  constructor(private readonly replyRepository: ReplyRepository) {}

  async execute(payload: DeleteReplyPayload): Promise<void> {
    const { threadId, commentId, replyId, owner } = new DeleteReply(payload);

    const isReplyExists = await this.replyRepository.checkReplyAvailability(
      replyId,
      commentId,
      threadId,
    );
    if (!isReplyExists) {
      throw new Error('DELETE_REPLY_USE_CASE.REPLY_NOT_FOUND');
    }
    const isReplyOwner = await this.replyRepository.verifyReplyOwner(
      replyId,
      owner,
    );
    if (!isReplyOwner) {
      throw new Error('DELETE_REPLY_USE_CASE.REPLY_NOT_OWNER');
    }

    await this.replyRepository.deleteReply(replyId);
  }
}

export default DeleteReplyUseCase;
