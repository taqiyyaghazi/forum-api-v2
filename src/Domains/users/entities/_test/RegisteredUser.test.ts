import { describe, expect, it } from 'vitest';
import RegisteredUser, { RegisteredUserPayload } from '../RegisteredUser.js';

describe('RegisteredUser entity', () => {
  it('should throw error when payload is undefined', () => {
    // Arrange
    const payload = undefined as unknown as RegisteredUserPayload;

    // Action and Assert
    expect(() => new RegisteredUser(payload)).toThrowError(
      'REGISTERED_USER.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      username: 'dicoding',
      fullname: 'Dicoding Indonesia',
    } as RegisteredUserPayload;

    // Action and Assert
    expect(() => new RegisteredUser(payload)).toThrowError(
      'REGISTERED_USER.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      username: 'dicoding',
      fullname: {},
    } as unknown as RegisteredUserPayload;

    // Action and Assert
    expect(() => new RegisteredUser(payload)).toThrowError(
      'REGISTERED_USER.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create registeredUser object correctly', () => {
    // Arrange
    const payload: RegisteredUserPayload = {
      id: 'user-123',
      username: 'dicoding',
      fullname: 'Dicoding Indonesia',
    };

    // Action
    const registeredUser = new RegisteredUser(payload);

    // Assert
    expect(registeredUser.id).toEqual('user-123');
    expect(registeredUser.username).toEqual('dicoding');
    expect(registeredUser.fullname).toEqual('Dicoding Indonesia');
  });
});
