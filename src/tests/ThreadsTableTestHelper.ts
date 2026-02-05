import pool from '../Infrastructures/database/postgres/pool.js';

interface Thread {
  id: string;
  title: string;
  body: string;
  owner: string;
}

const ThreadsTableTestHelper = {
  async addThread({
    id = 'thread-123',
    title = 'A Thread Title',
    body = 'Thread body content',
    owner = 'user-123',
  }: {
    id?: string;
    title?: string;
    body?: string;
    owner?: string;
  }): Promise<void> {
    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4)',
      values: [id, title, body, owner],
    };

    await pool.query(query);
  },

  async findThreadById(id: string): Promise<Thread[]> {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);

    return result.rows;
  },

  async cleanTable(): Promise<void> {
    await pool.query('DELETE FROM threads WHERE 1=1');
  },
};

export default ThreadsTableTestHelper;
