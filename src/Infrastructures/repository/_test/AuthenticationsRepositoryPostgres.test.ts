import { afterAll, afterEach, describe, expect, it } from 'vitest';
import AuthenticationsTableTestHelper from '../../../tests/AuthenticationsTableTestHelper.js';
import pool from '../../database/postgres/pool.js';
import AuthenticationRepositoryPostgres from '../AuthenticationRepositoryPostgres.js';

describe('AuthenticationRepositoryPostgres', () => {
  afterEach(async () => {
    await AuthenticationsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  it('should add a token correctly', async () => {
    // Arrange
    const authenticationRepository = new AuthenticationRepositoryPostgres(pool);
    const token = 'token';

    // Action
    await authenticationRepository.addToken(token);

    // Assert
    const tokens = await AuthenticationsTableTestHelper.findToken(token);
    expect(tokens).toHaveLength(1);
    expect(tokens[0].token).toBe(token);
  });

  it('should check availability token correctly', async () => {
    // Arrange
    const authenticationRepository = new AuthenticationRepositoryPostgres(pool);
    const token = 'token';
    await AuthenticationsTableTestHelper.addToken(token);

    // Action
    const isAvailable =
      await authenticationRepository.checkAvailabilityToken(token);

    // Assert
    expect(isAvailable).toBe(true);
  });

  it('should delete a token correctly', async () => {
    // Arrange
    const authenticationRepository = new AuthenticationRepositoryPostgres(pool);
    const token = 'token';
    await AuthenticationsTableTestHelper.addToken(token);

    // Action
    await authenticationRepository.deleteToken(token);

    // Assert
    const tokens = await AuthenticationsTableTestHelper.findToken(token);
    expect(tokens).toHaveLength(0);
  });
});
