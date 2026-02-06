/* eslint-disable @typescript-eslint/no-unused-vars */
import AddedReply from './entities/AddedReply.js';
import NewReply from './entities/NewReply.js';

class ReplyRepository {
  async addReply(
    _newReply: NewReply,
    _commentId: string,
    _owner: string,
  ): Promise<AddedReply> {
    throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getRepliesByThreadId(_threadId: string): Promise<
    {
      id: string;
      content: string;
      date: Date;
      username: string;
      isDeleted: boolean;
      commentId: string;
    }[]
  > {
    throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async checkReplyAvailability(
    _replyId: string,
    _commentId: string,
    _threadId: string,
  ): Promise<boolean> {
    throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyReplyOwner(_replyId: string, _owner: string): Promise<boolean> {
    throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async deleteReply(_replyId: string): Promise<void> {
    throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

export default ReplyRepository;
