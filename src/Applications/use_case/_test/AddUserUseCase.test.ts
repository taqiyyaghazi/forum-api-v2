import { describe, expect, it, vi } from 'vitest';
import AddUserUseCase from '../AddUserUseCase.js';
import UserRepository from '../../../Domains/users/UserRepository.js';
import PasswordHash from '../../security/PasswordHash.js';

describe('AddUserUseCase', () => {
  it('should throw error when username is already taken', async () => {
    // Arrange
    const payload = {
      username: 'dicoding',
      password: 'secret',
      fullname: 'Dicoding Indonesia',
    };

    const mockUserRepository = {
      verifyAvailableUsername: vi.fn().mockResolvedValue(true),
      addUser: vi.fn(),
    } as unknown as UserRepository;

    const mockPasswordHash = {
      hash: vi.fn(),
    } as unknown as PasswordHash;

    const addUserUseCase = new AddUserUseCase(
      mockUserRepository,
      mockPasswordHash,
    );

    // Action and Assert
    await expect(addUserUseCase.execute(payload)).rejects.toThrowError(
      'ADD_USER_USE_CASE.USERNAME_ALREADY_TAKEN',
    );
  });

  it('should orchestrate the add user action correctly', async () => {
    // Arrange
    const payload = {
      username: 'dicoding',
      password: 'secret',
      fullname: 'Dicoding Indonesia',
    };

    const mockUserRepository = {
      verifyAvailableUsername: vi.fn().mockResolvedValue(false),
      addUser: vi.fn().mockResolvedValue({
        id: 'user-123',
        username: 'dicoding',
        fullname: 'Dicoding Indonesia',
      }),
    } as unknown as UserRepository;

    const mockPasswordHash = {
      hash: vi.fn().mockResolvedValue('hashed_password'),
    } as unknown as PasswordHash;

    const addUserUseCase = new AddUserUseCase(
      mockUserRepository,
      mockPasswordHash,
    );

    // Action
    const result = await addUserUseCase.execute(payload);

    // Assert
    expect(result).toEqual({
      id: 'user-123',
      username: 'dicoding',
      fullname: 'Dicoding Indonesia',
    });

    expect(mockUserRepository.verifyAvailableUsername).toBeCalledWith(
      payload.username,
    );
    expect(mockPasswordHash.hash).toBeCalledWith(payload.password);
    expect(mockUserRepository.addUser).toBeCalledWith({
      username: payload.username,
      password: 'hashed_password',
      fullname: payload.fullname,
    });
  });
});
