import { describe, expect, it, vi } from 'vitest';
import AuthenticationRepository from '../../../Domains/authentications/AuthenticationRepository.js';
import UserRepository from '../../../Domains/users/UserRepository.js';
import PasswordHash from '../../security/PasswordHash.js';
import TokenManager from '../../security/TokenManager.js';
import UserLoginUseCase from '../LoginUserUseCase.js';

describe('UserLoginUseCase', () => {
  it('should throw error when user credentials not found', async () => {
    // Arrange
    const payload = {
      username: 'dicoding',
      password: 'secret',
    };

    const mockUserRepository = new UserRepository();
    mockUserRepository.getCredentialsByUsername = vi
      .fn()
      .mockResolvedValue(null);

    const mockAuthenticationRepository = new AuthenticationRepository();
    const mockTokenManager = new TokenManager();
    const mockPasswordHash = new PasswordHash();

    const userLoginUseCase = new UserLoginUseCase(
      mockAuthenticationRepository,
      mockTokenManager,
      mockUserRepository,
      mockPasswordHash,
    );

    // Action and Assert
    await expect(userLoginUseCase.execute(payload)).rejects.toThrowError(
      'USER_LOGIN_USE_CASE.USERNAME_NOT_FOUND',
    );
  });

  it('should throw error when password is invalid', async () => {
    // Arrange
    const payload = {
      username: 'dicoding',
      password: 'secret',
    };

    const mockUserRepository = new UserRepository();
    mockUserRepository.getCredentialsByUsername = vi.fn().mockResolvedValue({
      id: 'user-123',
      password: 'hashed_password',
    });

    const mockPasswordHash = new PasswordHash();
    mockPasswordHash.compare = vi.fn().mockResolvedValue(false);

    const mockAuthenticationRepository = new AuthenticationRepository();
    const mockTokenManager = new TokenManager();

    const userLoginUseCase = new UserLoginUseCase(
      mockAuthenticationRepository,
      mockTokenManager,
      mockUserRepository,
      mockPasswordHash,
    );

    // Action and Assert
    await expect(userLoginUseCase.execute(payload)).rejects.toThrowError(
      'USER_LOGIN_USE_CASE.INVALID_CREDENTIALS',
    );
  });

  it('should orchestrate the login user action correctly', async () => {
    // Arrange
    const payload = {
      username: 'dicoding',
      password: 'secret',
    };

    const mockUserRepository = new UserRepository();
    mockUserRepository.getCredentialsByUsername = vi.fn().mockResolvedValue({
      id: 'user-123',
      password: 'hashed_password',
    });

    const mockPasswordHash = new PasswordHash();
    mockPasswordHash.compare = vi.fn().mockResolvedValue(true);

    const mockTokenManager = new TokenManager();
    mockTokenManager.createAccessToken = vi
      .fn()
      .mockResolvedValue('access_token');
    mockTokenManager.createRefreshToken = vi
      .fn()
      .mockResolvedValue('refresh_token');

    const mockAuthenticationRepository = new AuthenticationRepository();
    mockAuthenticationRepository.addToken = vi
      .fn()
      .mockResolvedValue(undefined);

    const userLoginUseCase = new UserLoginUseCase(
      mockAuthenticationRepository,
      mockTokenManager,
      mockUserRepository,
      mockPasswordHash,
    );

    // Action
    const result = await userLoginUseCase.execute(payload);

    // Assert
    expect(result).toEqual({
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
    });

    expect(mockUserRepository.getCredentialsByUsername).toBeCalledWith(
      'dicoding',
    );
    expect(mockPasswordHash.compare).toBeCalledWith(
      'secret',
      'hashed_password',
    );
    expect(mockTokenManager.createAccessToken).toBeCalledWith({
      id: 'user-123',
    });
    expect(mockTokenManager.createRefreshToken).toBeCalledWith({
      id: 'user-123',
    });
    expect(mockAuthenticationRepository.addToken).toBeCalledWith(
      'refresh_token',
    );
  });
});
