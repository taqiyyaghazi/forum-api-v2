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

    const mockTokenManager = {
      verifyRefreshToken: vi.fn().mockResolvedValue(false),
    } as unknown as TokenManager;

    const mockAuthenticationRepository = {} as AuthenticationRepository;

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

    const mockTokenManager = {
      verifyRefreshToken: vi.fn().mockResolvedValue(true),
    } as unknown as TokenManager;

    const mockAuthenticationRepository = {
      checkAvailabilityToken: vi.fn().mockResolvedValue(false),
    } as unknown as AuthenticationRepository;

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

    const mockTokenManager = {
      verifyRefreshToken: vi.fn().mockResolvedValue(true),
      decodePayload: vi.fn().mockResolvedValue({ id: 'user-123' }),
      createAccessToken: vi.fn().mockResolvedValue('new_access_token'),
    } as unknown as TokenManager;

    const mockAuthenticationRepository = {
      checkAvailabilityToken: vi.fn().mockResolvedValue(true),
      deleteToken: vi.fn().mockResolvedValue(undefined),
    } as unknown as AuthenticationRepository;

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

    expect(mockTokenManager.verifyRefreshToken).toBeCalledWith(
      payload.refreshToken,
    );
    expect(mockAuthenticationRepository.checkAvailabilityToken).toBeCalledWith(
      payload.refreshToken,
    );
    expect(mockAuthenticationRepository.deleteToken).toBeCalledWith(
      payload.refreshToken,
    );
    expect(mockTokenManager.decodePayload).toBeCalledWith(
      payload.refreshToken,
    );
    expect(mockTokenManager.createAccessToken).toBeCalledWith({
      id: 'user-123',
    });
  });
});
