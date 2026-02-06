import { describe, expect, it } from 'vitest';
import TokenManager from '../TokenManager.js';

describe('TokenManager', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const tokenManager = new TokenManager();

    // Action & Assert
    await expect(tokenManager.createAccessToken({ id: '123' })).rejects.toThrow(
      'TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED',
    );
    await expect(
      tokenManager.createRefreshToken({ id: '123' }),
    ).rejects.toThrow('TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
    await expect(tokenManager.verifyRefreshToken('')).rejects.toThrow(
      'TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED',
    );
    await expect(tokenManager.decodePayload('')).rejects.toThrow(
      'TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED',
    );
  });
});
