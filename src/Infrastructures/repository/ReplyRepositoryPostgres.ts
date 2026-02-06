import { Pool } from 'pg';
import ReplyRepository from '../../Domains/replies/ReplyRepository.js';
import AddedReply from '../../Domains/replies/entities/AddedReply.js';
import NewReply from '../../Domains/replies/entities/NewReply.js';

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(
    private readonly pool: Pool,
    private readonly idGenerator: () => string,
  ) {
    super();
  }

  async addReply(
    newReply: NewReply,
    commentId: string,
    owner: string,
  ): Promise<AddedReply> {
    const { content } = newReply;
    const id = `reply-${this.idGenerator()}`;

    const query = {
      text: 'INSERT INTO replies (id, content, owner, comment_id) VALUES($1, $2, $3, $4) RETURNING id, content, owner',
      values: [id, content, owner, commentId],
    };

    const result = await this.pool.query(query);

    return new AddedReply({ ...result.rows[0] });
  }

  async getRepliesByThreadId(threadId: string): Promise<
    {
      id: string;
      content: string;
      date: Date;
      username: string;
      isDeleted: boolean;
      commentId: string;
    }[]
  > {
    const query = {
      text: `
        SELECT replies.id, replies.content, replies.date, users.username, replies.is_deleted AS "isDeleted", replies.comment_id AS "commentId"
        FROM replies
        INNER JOIN users ON replies.owner = users.id
        INNER JOIN comments ON replies.comment_id = comments.id
        WHERE comments.thread_id = $1
        ORDER BY replies.date ASC
      `,
      values: [threadId],
    };

    const result = await this.pool.query(query);

    return result.rows;
  }

  async checkReplyAvailability(
    replyId: string,
    commentId: string,
    threadId: string,
  ): Promise<boolean> {
    const query = {
      text: `
        SELECT replies.id
        FROM replies
        INNER JOIN comments ON replies.comment_id = comments.id
        WHERE replies.id = $1
        AND replies.comment_id = $2
        AND comments.thread_id = $3
      `,
      values: [replyId, commentId, threadId],
    };

    const result = await this.pool.query(query);

    return !!result.rowCount;
  }

  async verifyReplyOwner(replyId: string, owner: string): Promise<boolean> {
    const query = {
      text: 'SELECT owner FROM replies WHERE id = $1 AND owner = $2',
      values: [replyId, owner],
    };

    const result = await this.pool.query(query);

    return !!result.rowCount;
  }

  async deleteReply(replyId: string): Promise<void> {
    const query = {
      text: 'UPDATE replies SET is_deleted = true WHERE id = $1',
      values: [replyId],
    };

    await this.pool.query(query);
  }
}

export default ReplyRepositoryPostgres;
