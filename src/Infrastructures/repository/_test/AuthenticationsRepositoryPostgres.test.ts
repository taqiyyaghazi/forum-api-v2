import AuthenticationsTableTestHelper from '../../../tests/AuthenticationsTableTestHelper.js';
import pool from '../../database/postgres/pool.js';
import AuthenticationRepositoryPostgres from '../AuthenticationRepositoryPostgres.js';

describe.skip('AuthenticationRepositoryPostgres', () => {
  afterEach(async () => {
    await AuthenticationsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addToken function', () => {
    it('should add a token to the database', async () => {
      // Arrange
      const authenticationRepository = new AuthenticationRepositoryPostgres(
        pool,
      );
      const token = 'token';

      // Action
      await authenticationRepository.addToken(token);

      // Assert
      const tokens = await AuthenticationsTableTestHelper.findToken(token);
      expect(tokens).toHaveLength(1);
      expect(tokens[0].token).toBe(token);
    });
  });

  describe('checkAvailabilityToken function', () => {
    it('should return true if the token is available', async () => {
      // Arrange
      const authenticationRepository = new AuthenticationRepositoryPostgres(
        pool,
      );
      const token = 'token';
      await AuthenticationsTableTestHelper.addToken(token);

      // Action
      const isAvailable =
        await authenticationRepository.checkAvailabilityToken(token);

      // Assert
      expect(isAvailable).toBe(true);
    });

    it('should return false if the token is not available', async () => {
      // Arrange
      const authenticationRepository = new AuthenticationRepositoryPostgres(
        pool,
      );
      const token = 'token';

      // Action
      const isAvailable =
        await authenticationRepository.checkAvailabilityToken(token);

      // Assert
      expect(isAvailable).toBe(false);
    });
  });

  describe('deleteToken function', () => {
    it('should delete a token from the database', async () => {
      // Arrange
      const authenticationRepository = new AuthenticationRepositoryPostgres(
        pool,
      );
      const token = 'token';
      await AuthenticationsTableTestHelper.addToken(token);

      // Action
      await authenticationRepository.deleteToken(token);

      // Assert
      const tokens = await AuthenticationsTableTestHelper.findToken(token);
      expect(tokens).toHaveLength(0);
    });
  });
});
