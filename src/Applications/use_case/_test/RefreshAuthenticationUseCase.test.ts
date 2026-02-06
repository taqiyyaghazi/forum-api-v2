import { describe, expect, it, vi } from 'vitest';
import RefreshAuthenticationUseCase from '../RefreshAuthenticationUseCase.js';
import AuthenticationRepository from '../../../Domains/authentications/AuthenticationRepository.js';
import TokenManager from '../../security/TokenManager.js';

describe('RefreshAuthenticationUseCase', () => {
  it('should throw error when refresh token is invalid', async () => {
    // Arrange
    const payload = {
      refreshToken: 'refresh_token',
    };

    const mockTokenManager = new TokenManager();
    mockTokenManager.verifyRefreshToken = vi.fn().mockResolvedValue(false);

    const mockAuthenticationRepository = new AuthenticationRepository();

    const refreshAuthenticationUseCase = new RefreshAuthenticationUseCase(
      mockAuthenticationRepository,
      mockTokenManager,
    );

    // Action and Assert
    await expect(
      refreshAuthenticationUseCase.execute(payload),
    ).rejects.toThrowError('REFRESH_AUTHENTICATION_USE_CASE.INVALID_TOKEN');
  });

  it('should throw error when refresh token not found in database', async () => {
    // Arrange
    const payload = {
      refreshToken: 'refresh_token',
    };

    const mockTokenManager = new TokenManager();
    mockTokenManager.verifyRefreshToken = vi.fn().mockResolvedValue(true);

    const mockAuthenticationRepository = new AuthenticationRepository();
    mockAuthenticationRepository.checkAvailabilityToken = vi
      .fn()
      .mockResolvedValue(false);

    const refreshAuthenticationUseCase = new RefreshAuthenticationUseCase(
      mockAuthenticationRepository,
      mockTokenManager,
    );

    // Action and Assert
    await expect(
      refreshAuthenticationUseCase.execute(payload),
    ).rejects.toThrowError('REFRESH_AUTHENTICATION_USE_CASE.TOKEN_NOT_FOUND');
  });

  it('should orchestrate the refresh authentication action correctly', async () => {
    // Arrange
    const payload = {
      refreshToken: 'refresh_token',
    };

    const mockTokenManager = new TokenManager();
    mockTokenManager.verifyRefreshToken = vi.fn().mockResolvedValue(true);
    mockTokenManager.decodePayload = vi
      .fn()
      .mockResolvedValue({ id: 'user-123' });
    mockTokenManager.createAccessToken = vi
      .fn()
      .mockResolvedValue('new_access_token');

    const mockAuthenticationRepository = new AuthenticationRepository();
    mockAuthenticationRepository.checkAvailabilityToken = vi
      .fn()
      .mockResolvedValue(true);

    const refreshAuthenticationUseCase = new RefreshAuthenticationUseCase(
      mockAuthenticationRepository,
      mockTokenManager,
    );

    // Action
    const result = await refreshAuthenticationUseCase.execute(payload);

    // Assert
    expect(result).toEqual({
      accessToken: 'new_access_token',
    });

    expect(mockTokenManager.verifyRefreshToken).toBeCalledWith('refresh_token');
    expect(mockAuthenticationRepository.checkAvailabilityToken).toBeCalledWith(
      'refresh_token',
    );
    expect(mockTokenManager.decodePayload).toBeCalledWith('refresh_token');
    expect(mockTokenManager.createAccessToken).toBeCalledWith({
      id: 'user-123',
    });
  });
});
