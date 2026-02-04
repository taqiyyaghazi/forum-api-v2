import { Pool } from 'pg';
import RegisteredUser from '../../Domains/users/entities/RegisteredUser.js';
import UserRepository, {
  RegisterUser,
  RegisteredUser as RegisteredUserType,
  UserCredentials,
} from '../../Domains/users/UserRepository.js';

class UserRepositoryPostgres extends UserRepository {
  constructor(
    private readonly pool: Pool,
    private readonly idGenerator: () => string,
  ) {
    super();
  }

  async verifyAvailableUsername(username: string): Promise<boolean> {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this.pool.query(query);

    return !!result.rowCount;
  }

  async addUser(registerUser: RegisterUser): Promise<RegisteredUserType> {
    const { username, password, fullname } = registerUser;
    const id = `user-${this.idGenerator()}`;

    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id, username, fullname',
      values: [id, username, password, fullname],
    };

    const result = await this.pool.query(query);

    return new RegisteredUser({ ...result.rows[0] });
  }

  async getCredentialsByUsername(
    username: string,
  ): Promise<UserCredentials | null> {
    const query = {
      text: 'SELECT id, password FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this.pool.query(query);

    if (!result.rowCount) {
      return null;
    }

    return {
      id: result.rows[0].id,
      password: result.rows[0].password,
    };
  }
}

export default UserRepositoryPostgres;
