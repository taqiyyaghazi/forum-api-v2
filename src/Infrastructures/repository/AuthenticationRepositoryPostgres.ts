import { Pool } from 'pg';
import AuthenticationRepository from '../../Domains/authentications/AuthenticationRepository.js';

class AuthenticationRepositoryPostgres extends AuthenticationRepository {
  constructor(private readonly pool: Pool) {
    super();
  }

  async addToken(token: string): Promise<void> {
    const query = {
      text: 'INSERT INTO authentications VALUES($1)',
      values: [token],
    };

    await this.pool.query(query);
  }

  async checkAvailabilityToken(token: string): Promise<boolean> {
    const query = {
      text: 'SELECT token FROM authentications WHERE token = $1',
      values: [token],
    };

    const result = await this.pool.query(query);

    return !!result.rowCount;
  }

  async deleteToken(token: string): Promise<void> {
    const query = {
      text: 'DELETE FROM authentications WHERE token = $1',
      values: [token],
    };

    await this.pool.query(query);
  }
}

export default AuthenticationRepositoryPostgres;
