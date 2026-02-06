/* eslint-disable @typescript-eslint/no-unused-vars */

import AddedComment from './entities/AddedComment.js';
import NewComment from './entities/NewComment.js';

class CommentRepository {
  async addComment(_newComment: NewComment): Promise<AddedComment> {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getCommentsByThreadId(_threadId: string): Promise<
    {
      id: string;
      username: string;
      date: Date;
      content: string;
      isDeleted: boolean;
    }[]
  > {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async isCommentExist(_commentId: string): Promise<boolean> {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyCommentOwner(
    _commentId: string,
    _owner: string,
  ): Promise<boolean> {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async deleteComment(_commentId: string): Promise<void> {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

export default CommentRepository;
