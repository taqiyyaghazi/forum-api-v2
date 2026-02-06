import { describe, expect, it } from 'vitest';
import RegisterUser, { RegisterUserPayload } from '../RegisterUser.js';

describe('RegisterUser entity', () => {
  it('should throw error when payload is undefined', () => {
    // Arrange
    const payload = undefined as unknown as RegisterUserPayload;

    // Action and Assert
    expect(() => new RegisterUser(payload)).toThrowError(
      'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      username: 'dicoding',
      password: 'secret',
    } as RegisterUserPayload;

    // Action and Assert
    expect(() => new RegisterUser(payload)).toThrowError(
      'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      username: 123,
      password: 'secret',
      fullname: true,
    } as unknown as RegisterUserPayload;

    // Action and Assert
    expect(() => new RegisterUser(payload)).toThrowError(
      'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should throw error when username contains more than 50 characters', () => {
    // Arrange
    const payload = {
      username: 'dicodingindonesiadicodingindonesiadicodingindonesiadi',
      password: 'secret',
      fullname: 'Dicoding Indonesia',
    };

    // Action and Assert
    expect(() => new RegisterUser(payload)).toThrowError(
      'REGISTER_USER.USERNAME_LIMIT_CHAR',
    );
  });

  it('should throw error when username contains restricted character', () => {
    // Arrange
    const payload = {
      username: 'dico ding',
      password: 'secret',
      fullname: 'Dicoding Indonesia',
    };

    // Action and Assert
    expect(() => new RegisterUser(payload)).toThrowError(
      'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER',
    );
  });

  it('should create registerUser object correctly', () => {
    // Arrange
    const payload: RegisterUserPayload = {
      username: 'dicoding',
      password: 'secret',
      fullname: 'Dicoding Indonesia',
    };

    // Action
    const registerUser = new RegisterUser(payload);

    // Assert
    expect(registerUser.username).toEqual('dicoding');
    expect(registerUser.password).toEqual('secret');
    expect(registerUser.fullname).toEqual('Dicoding Indonesia');
  });
});
