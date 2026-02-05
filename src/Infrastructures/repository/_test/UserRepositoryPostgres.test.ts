import RegisteredUser from '../../../Domains/users/entities/RegisteredUser.js';
import RegisterUser from '../../../Domains/users/entities/RegisterUser.js';
import UsersTableTestHelper from '../../../tests/UsersTableTestHelper.js';
import pool from '../../database/postgres/pool.js';
import UserRepositoryPostgres from '../UserRepositoryPostgres.js';

describe.skip('UserRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('verifyAvailableUsername function', () => {
    it('should return true when username available', async () => {
      // Arrange
      const idGenerator = (): string => '123';
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      const userRepository = new UserRepositoryPostgres(pool, idGenerator);

      // Action
      const isAvailable =
        await userRepository.verifyAvailableUsername('dicoding');

      // Assert
      expect(isAvailable).toBe(true);
    });

    it('should return false when username not available', async () => {
      // Arrange
      const idGenerator = (): string => '123';
      const userRepository = new UserRepositoryPostgres(pool, idGenerator);

      // Action
      const isAvailable =
        await userRepository.verifyAvailableUsername('dicoding');

      // Assert
      expect(isAvailable).toBe(false);
    });
  });

  describe('addUser function', () => {
    it('should persist register user and return registered user correctly', async () => {
      // Arrange
      const idGenerator = (): string => '123';
      const userRepository = new UserRepositoryPostgres(pool, idGenerator);
      const registerUser = new RegisterUser({
        username: 'dicoding',
        password: 'password',
        fullname: 'Dicoding',
      });

      // Action
      await userRepository.addUser(registerUser);

      // Assert
      const user = await UsersTableTestHelper.findUserById('user-123');
      expect(user).toHaveLength(1);
      expect(user[0].username).toBe('dicoding');
      expect(user[0].fullname).toBe('Dicoding');
    });

    it('should return registered user correctly', async () => {
      // Arrange
      const idGenerator = (): string => '123';
      const userRepository = new UserRepositoryPostgres(pool, idGenerator);
      const registerUser = new RegisterUser({
        username: 'dicoding',
        password: 'password',
        fullname: 'Dicoding',
      });

      // Action
      const registeredUser = await userRepository.addUser(registerUser);

      // Assert
      expect(registeredUser).toStrictEqual(
        new RegisteredUser({
          id: 'user-123',
          username: 'dicoding',
          fullname: 'Dicoding',
        }),
      );
    });
  });

  describe('getCredentialsByUsername function', () => {
    it('should return user credentials when username available', async () => {
      // Arrange
      const idGenerator = (): string => '123';
      const userRepository = new UserRepositoryPostgres(pool, idGenerator);
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
        password: 'password',
        fullname: 'Dicoding',
      });

      // Action
      const credentials =
        await userRepository.getCredentialsByUsername('dicoding');

      // Assert
      expect(credentials).toStrictEqual({
        id: 'user-123',
        password: 'password',
      });
    });

    it('should return null when username not available', async () => {
      // Arrange
      const idGenerator = (): string => '123';
      const userRepository = new UserRepositoryPostgres(pool, idGenerator);

      // Action
      const credentials =
        await userRepository.getCredentialsByUsername('dicoding');

      // Assert
      expect(credentials).toBeNull();
    });
  });
});
