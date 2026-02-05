import { Pool } from 'pg';
import CommentRepository from '../../Domains/comments/CommentRepository.js';
import NewComment from '../../Domains/comments/entities/NewComment.js';
import AddedComment from '../../Domains/comments/entities/AddedComment.js';

class CommentRepositoryPostgres extends CommentRepository {
  constructor(
    private readonly pool: Pool,
    private readonly idGenerator: () => string,
  ) {
    super();
  }

  async addComment(newComment: NewComment): Promise<AddedComment> {
    const { content, threadId, owner } = newComment;
    const id = `comment-${this.idGenerator()}`;

    const query = {
      text: 'INSERT INTO comments (id, content, owner, thread_id) VALUES($1, $2, $3, $4) RETURNING id, content, owner',
      values: [id, content, owner, threadId],
    };

    const result = await this.pool.query(query);

    return new AddedComment({ ...result.rows[0] });
  }
}

export default CommentRepositoryPostgres;
