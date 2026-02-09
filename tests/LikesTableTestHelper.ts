/* istanbul ignore file */
import pool from '../src/Infrastructures/database/postgres/pool.js';

const LikesTableTestHelper = {
  async addLike({
    id,
    owner,
    commentId,
  }: {
    id: string;
    owner: string;
    commentId: string;
  }): Promise<void> {
    const query = {
      text: 'INSERT INTO likes VALUES($1, $2, $3)',
      values: [id, owner, commentId],
    };

    await pool.query(query);
  },

  async findLikeByCommentId(id: string): Promise<
    | {
        id: string;
        owner: string;
        comment_id: string;
        date: Date;
      }
    | undefined
  > {
    const query = {
      text: 'SELECT * FROM likes WHERE comment_id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows[0];
  },

  async cleanTable(): Promise<void> {
    await pool.query('DELETE FROM likes WHERE 1=1');
  },
};

export default LikesTableTestHelper;
