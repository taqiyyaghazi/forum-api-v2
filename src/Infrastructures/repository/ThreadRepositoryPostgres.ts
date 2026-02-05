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
}

export default ThreadRepositoryPostgres;
