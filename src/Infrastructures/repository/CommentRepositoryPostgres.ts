import { Pool } from 'pg';
import CommentRepository from '../../Domains/comments/CommentRepository.js';
import AddedComment from '../../Domains/comments/entities/AddedComment.js';
import NewComment from '../../Domains/comments/entities/NewComment.js';

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

  async getCommentsByThreadId(threadId: string): Promise<
    {
      id: string;
      username: string;
      date: Date;
      content: string;
      isDeleted: boolean;
      likeCount: number;
    }[]
  > {
    const query = {
      text: `
        SELECT comments.id, users.username, comments.date, comments.content, comments.is_deleted as "isDeleted", COUNT(likes.id)::int AS "likeCount"
        FROM comments
        INNER JOIN users ON comments.owner = users.id
        LEFT JOIN likes ON comments.id = likes.comment_id
        WHERE comments.thread_id = $1
        GROUP BY comments.id, users.username
        ORDER BY comments.date ASC
      `,
      values: [threadId],
    };

    const result = await this.pool.query(query);

    return result.rows;
  }

  async verifyCommentAvailability(
    commentId: string,
    threadId: string,
  ): Promise<boolean> {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1 AND thread_id = $2',
      values: [commentId, threadId],
    };

    const result = await this.pool.query(query);

    return !!result.rowCount;
  }

  async verifyCommentOwner(commentId: string, owner: string): Promise<boolean> {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1 AND owner = $2',
      values: [commentId, owner],
    };

    const result = await this.pool.query(query);

    return !!result.rowCount;
  }

  async deleteComment(commentId: string): Promise<void> {
    const query = {
      text: 'UPDATE comments SET is_deleted = true WHERE id = $1',
      values: [commentId],
    };

    await this.pool.query(query);
  }
}

export default CommentRepositoryPostgres;
