import { describe, expect, it } from 'vitest';
import UserLogin, { UserLoginPayload } from '../UserLogin.js';

describe('UserLogin entity', () => {
  it('should throw error when payload is undefined', () => {
    // Arrange
    const payload = undefined as unknown as UserLoginPayload;

    // Action and Assert
    expect(() => new UserLogin(payload)).toThrowError(
      'USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      username: 'dicoding',
    } as UserLoginPayload;

    // Action and Assert
    expect(() => new UserLogin(payload)).toThrowError(
      'USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      username: 123,
      password: true,
    } as unknown as UserLoginPayload;

    // Action and Assert
    expect(() => new UserLogin(payload)).toThrowError(
      'USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create userLogin object correctly', () => {
    // Arrange
    const payload: UserLoginPayload = {
      username: 'dicoding',
      password: 'secret',
    };

    // Action
    const userLogin = new UserLogin(payload);

    // Assert
    expect(userLogin.username).toEqual('dicoding');
    expect(userLogin.password).toEqual('secret');
  });
});
