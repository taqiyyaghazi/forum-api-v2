import pool from '../Infrastructures/database/postgres/pool.js';

const RepliesTableTestHelper = {
  async cleanTable(): Promise<void> {
    await pool.query('DELETE FROM replies WHERE 1=1');
  },

  async findReplyById(id: string): Promise<
    {
      id: string;
      content: string;
      owner: string;
      comment_id: string;
      date: Date;
      is_deleted: boolean;
    } | undefined
  > {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);

    return result.rows[0];
  },

  async addReply({
    id = 'reply-123',
    content = 'sebuah reply',
    owner = 'user-123',
    commentId = 'comment-123',
    date = new Date(),
    isDeleted = false,
  }): Promise<void> {
    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, content, owner, commentId, isDeleted, date],
    };

    await pool.query(query);
  },
};

export default RepliesTableTestHelper;
