import jwt from 'jsonwebtoken';
import { TokenPayload } from '../../../Applications/security/TokenManager.js';
import config from '../../../Commons/config.js';
import JwtTokenManager from '../JwtTokenManager.js';

describe('JwtTokenManager', () => {
  describe('createAccessToken function', () => {
    it('should create accessToken correctly', async () => {
      // Arrange
      const payload: TokenPayload = {
        id: 'user-123',
      };
      const mockJwtToken = {
        sign: vi.fn().mockImplementation(() => 'mock_token'),
      } as unknown as typeof jwt;
      const jwtTokenManager = new JwtTokenManager(mockJwtToken);

      // Action
      const accessToken = await jwtTokenManager.createAccessToken(payload);

      // Assert
      expect(accessToken).toStrictEqual('mock_token');
      expect(mockJwtToken.sign).toHaveBeenCalledWith(
        payload,
        config.auth.accessTokenKey,
      );
    });
  });

  describe('createRefreshToken function', () => {
    it('should create refreshToken correctly', async () => {
      // Arrange
      const payload: TokenPayload = {
        id: 'user-123',
      };
      const mockJwtToken = {
        sign: vi.fn().mockImplementation(() => 'mock_token'),
      } as unknown as typeof jwt;
      const jwtTokenManager = new JwtTokenManager(mockJwtToken);

      // Action
      const refreshToken = await jwtTokenManager.createRefreshToken(payload);

      // Assert
      expect(refreshToken).toStrictEqual('mock_token');
      expect(mockJwtToken.sign).toHaveBeenCalledWith(
        payload,
        config.auth.refreshTokenKey,
      );
    });
  });

  describe('verifyRefreshToken function', () => {
    it('should return false when verification failed', async () => {
      // Arrange
      const mockJwtToken = {
        verify: vi.fn().mockImplementation(() => {
          throw new Error('invalid signature');
        }),
      } as unknown as typeof jwt;
      const jwtTokenManager = new JwtTokenManager(mockJwtToken);

      // Action
      const isVerified = await jwtTokenManager.verifyRefreshToken('mock_token');

      // Assert
      expect(isVerified).toStrictEqual(false);
      expect(mockJwtToken.verify).toHaveBeenCalledWith(
        'mock_token',
        config.auth.refreshTokenKey,
      );
    });

    it('should return true when verification success', async () => {
      // Arrange
      const mockJwtToken = {
        verify: vi.fn().mockImplementation(() => ({})),
      } as unknown as typeof jwt;
      const jwtTokenManager = new JwtTokenManager(mockJwtToken);

      // Action
      const isVerified = await jwtTokenManager.verifyRefreshToken('mock_token');

      // Assert
      expect(isVerified).toStrictEqual(true);
      expect(mockJwtToken.verify).toHaveBeenCalledWith(
        'mock_token',
        config.auth.refreshTokenKey,
      );
    });
  });

  describe('decodePayload function', () => {
    it('should decode payload correctly', async () => {
      // Arrange
      const mockJwtToken = {
        decode: vi.fn().mockImplementation(() => ({})),
      } as unknown as typeof jwt;
      const jwtTokenManager = new JwtTokenManager(mockJwtToken);

      // Action
      const payload = await jwtTokenManager.decodePayload('mock_token');

      // Assert
      expect(payload).toStrictEqual({});
      expect(mockJwtToken.decode).toHaveBeenCalledWith('mock_token');
    });
  });
});
