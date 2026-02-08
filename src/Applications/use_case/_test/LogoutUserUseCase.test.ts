import { describe, expect, it, vi } from 'vitest';
import LogoutUserUseCase, {
  LogoutUserUseCasePayload,
} from '../LogoutUserUseCase.js';
import AuthenticationRepository from '../../../Domains/authentications/AuthenticationRepository.js';

describe('LogoutUserUseCase', () => {
  it('should throw error when refresh token not found', async () => {
    // Arrange
    const payload: LogoutUserUseCasePayload = {
      refreshToken: 'refresh_token',
    };

    const mockAuthenticationRepository = new AuthenticationRepository();

    mockAuthenticationRepository.checkAvailabilityToken = vi
      .fn()
      .mockResolvedValue(false);
    mockAuthenticationRepository.deleteToken = vi.fn();

    const logoutUserUseCase = new LogoutUserUseCase(
      mockAuthenticationRepository,
    );

    // Action and Assert
    await expect(logoutUserUseCase.execute(payload)).rejects.toThrowError(
      'LOGOUT_USER_USE_CASE.REFRESH_TOKEN_NOT_FOUND',
    );
    expect(mockAuthenticationRepository.deleteToken).not.toBeCalled();
  });

  it('should orchestrate the logout user action correctly', async () => {
    // Arrange
    const payload: LogoutUserUseCasePayload = {
      refreshToken: 'refresh_token',
    };

    const mockAuthenticationRepository = new AuthenticationRepository();

    mockAuthenticationRepository.checkAvailabilityToken = vi
      .fn()
      .mockResolvedValue(true);
    mockAuthenticationRepository.deleteToken = vi
      .fn()
      .mockResolvedValue(undefined);

    const logoutUserUseCase = new LogoutUserUseCase(
      mockAuthenticationRepository,
    );

    // Action
    await logoutUserUseCase.execute(payload);

    // Assert
    expect(mockAuthenticationRepository.checkAvailabilityToken).toBeCalledWith(
      payload.refreshToken,
    );
    expect(mockAuthenticationRepository.deleteToken).toBeCalledWith(
      payload.refreshToken,
    );
  });
});
