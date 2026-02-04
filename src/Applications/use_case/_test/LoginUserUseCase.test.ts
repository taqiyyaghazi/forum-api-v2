import { describe, expect, it, vi } from 'vitest';
import UserLoginUseCase from '../LoginUserUseCase.js';
import AuthenticationRepository from '../../../Domains/authentications/AuthenticationRepository.js';
import TokenManager from '../../security/TokenManager.js';
import UserRepository from '../../../Domains/users/UserRepository.js';
import PasswordHash from '../../security/PasswordHash.js';

describe('UserLoginUseCase', () => {
  it('should throw error when user credentials not found', async () => {
    // Arrange
    const payload = {
      username: 'dicoding',
      password: 'secret',
    };

    const mockUserRepository = {
      getCredentialsByUsername: vi.fn().mockResolvedValue(null),
    } as unknown as UserRepository;

    const mockAuthenticationRepository = {} as AuthenticationRepository;
    const mockTokenManager = {} as TokenManager;
    const mockPasswordHash = {} as PasswordHash;

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

    const mockUserRepository = {
      getCredentialsByUsername: vi.fn().mockResolvedValue({
        id: 'user-123',
        password: 'hashed_password',
      }),
    } as unknown as UserRepository;

    const mockPasswordHash = {
      compare: vi.fn().mockResolvedValue(false),
    } as unknown as PasswordHash;

    const mockAuthenticationRepository = {} as AuthenticationRepository;
    const mockTokenManager = {} as TokenManager;

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

    const mockUserRepository = {
      getCredentialsByUsername: vi.fn().mockResolvedValue({
        id: 'user-123',
        password: 'hashed_password',
      }),
    } as unknown as UserRepository;

    const mockPasswordHash = {
      compare: vi.fn().mockResolvedValue(true),
    } as unknown as PasswordHash;

    const mockTokenManager = {
      createAccessToken: vi.fn().mockResolvedValue('access_token'),
      createRefreshToken: vi.fn().mockResolvedValue('refresh_token'),
    } as unknown as TokenManager;

    const mockAuthenticationRepository = {
      addToken: vi.fn().mockResolvedValue(undefined),
    } as unknown as AuthenticationRepository;

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
      payload.username,
    );
    expect(mockPasswordHash.compare).toBeCalledWith(
      payload.password,
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
