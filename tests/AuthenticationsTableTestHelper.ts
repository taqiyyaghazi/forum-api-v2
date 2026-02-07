import pool from '../src/Infrastructures/database/postgres/pool.js';

interface Authentication {
  token: string;
}

const AuthenticationsTableTestHelper = {
  async addToken(token: string): Promise<void> {
    const query = {
      text: 'INSERT INTO authentications VALUES($1)',
      values: [token],
    };

    await pool.query(query);
  },

  async findToken(token: string): Promise<Authentication | undefined> {
    const query = {
      text: 'SELECT token FROM authentications WHERE token = $1',
      values: [token],
    };

    const result = await pool.query(query);

    return result.rows[0];
  },

  async cleanTable(): Promise<void> {
    await pool.query('DELETE FROM authentications WHERE 1=1');
  },
};

export default AuthenticationsTableTestHelper;
