/* eslint-disable @typescript-eslint/no-unused-vars */

import AddedComment from './entities/AddedComment.js';
import NewComment from './entities/NewComment.js';

class CommentRepository {
  async addComment(_newComment: NewComment): Promise<AddedComment> {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

export default CommentRepository;
