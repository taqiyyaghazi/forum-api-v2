import { Pool } from 'pg';
import ThreadRepository from '../../Domains/threads/ThreadRepository.js';
import NewThread from '../../Domains/threads/entities/NewThread.js';
import AddedThread from '../../Domains/threads/entities/AddedThread.js';

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(
    private readonly pool: Pool,
    private readonly idGenerator: () => string,
  ) {
    super();
  }

  async addThread(newThread: NewThread): Promise<AddedThread> {
    const { title, body, owner } = newThread;
    const id = `thread-${this.idGenerator()}`;

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4) RETURNING id, title, body, owner',
      values: [id, title, body, owner],
    };

    const result = await this.pool.query(query);

    return new AddedThread({ ...result.rows[0] });
  }

  async verifyThreadExists(threadId: string): Promise<boolean> {
    const query = {
      text: 'SELECT id FROM threads WHERE id = $1',
      values: [threadId],
    };

    const result = await this.pool.query(query);

    return !!result.rowCount;
  }

  async getThreadById(threadId: string): Promise<{
    id: string;
    title: string;
    body: string;
    date: Date;
    username: string;
  } | null> {
    const query = {
      text: `
        SELECT threads.id, threads.title, threads.body, threads.date, users.username
        FROM threads
        INNER JOIN users ON threads.owner = users.id
        WHERE threads.id = $1
      `,
      values: [threadId],
    };

    const result = await this.pool.query(query);

    if (!result.rowCount) {
      return null;
    }

    return result.rows[0];
  }
}

export default ThreadRepositoryPostgres;
