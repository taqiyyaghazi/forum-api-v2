import { Pool } from 'pg';
import { nanoid } from 'nanoid';
import LikeRepository from '../../Domains/likes/LikeRepository.js';

class LikeRepositoryPostgres implements LikeRepository {
  constructor(
    private readonly pool: Pool,
    private readonly idGenerator: () => string = nanoid,
  ) {}

  async addLike(userId: string, commentId: string): Promise<void> {
    const id = `like-${this.idGenerator()}`;
    const date = new Date().toISOString();
    const query = {
      text: 'INSERT INTO likes VALUES($1, $2, $3, $4)',
      values: [id, userId, commentId, date],
    };

    await this.pool.query(query);
  }

  async deleteLike(userId: string, commentId: string): Promise<void> {
    const query = {
      text: 'DELETE FROM likes WHERE owner = $1 AND comment_id = $2',
      values: [userId, commentId],
    };

    await this.pool.query(query);
  }

  async checkLikeStatus(userId: string, commentId: string): Promise<boolean> {
    const query = {
      text: 'SELECT id FROM likes WHERE owner = $1 AND comment_id = $2',
      values: [userId, commentId],
    };

    const result = await this.pool.query(query);

    return !!result.rowCount;
  }
}

export default LikeRepositoryPostgres;
