import pool from '../src/Infrastructures/database/postgres/pool.js';

interface User {
  id: string;
  username: string;
  password: string;
  fullname: string;
}

const UsersTableTestHelper = {
  async addUser({
    id = 'user-123',
    username = 'user',
    password = 'password',
    fullname = 'User',
  }: {
    id?: string;
    username?: string;
    password?: string;
    fullname?: string;
  }): Promise<void> {
    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4)',
      values: [id, username, password, fullname],
    };

    await pool.query(query);
  },

  async findUserById(id: string): Promise<User | undefined> {
    const query = {
      text: 'SELECT * FROM users WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);

    return result.rows[0];
  },

  async cleanTable(): Promise<void> {
    await pool.query('DELETE FROM users WHERE 1=1');
  },
};

export default UsersTableTestHelper;
