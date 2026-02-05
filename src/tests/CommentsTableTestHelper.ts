/* istanbul ignore file */
import pool from '../Infrastructures/database/postgres/pool.js';

const CommentsTableTestHelper = {
  async addComment({
    id = 'comment-123',
    content = 'sebuah comment',
    owner = 'user-123',
    threadId = 'thread-123',
    date = new Date(),
    isDeleted = false,
  }): Promise<void> {
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, content, owner, threadId, isDeleted, date],
    };

    await pool.query(query);
  },

  async findCommentById(id: string): Promise<{
    id: string;
    content: string;
    owner: string;
    thread_id: string;
    is_deleted: boolean;
    date: Date;
  }[]> {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable(): Promise<void> {
    await pool.query('DELETE FROM comments WHERE 1=1');
  },
};

export default CommentsTableTestHelper;
