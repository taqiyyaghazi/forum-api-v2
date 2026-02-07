import { afterAll, afterEach, describe, expect, it } from 'vitest';
import RegisterUser from '../../../Domains/users/entities/RegisterUser.js';
import UsersTableTestHelper from '../../../tests/UsersTableTestHelper.js';
import pool from '../../database/postgres/pool.js';
import UserRepositoryPostgres from '../UserRepositoryPostgres.js';

describe('UserRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  it('should verify available username correctly', async () => {
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

  it('should add user correctly', async () => {
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
