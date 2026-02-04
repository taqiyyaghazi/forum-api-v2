import { describe, expect, it } from 'vitest';
import NewAuth, { NewAuthPayload } from '../NewAuth.js';

describe('NewAuth entity', () => {
  it('should throw error when payload is undefined', () => {
    // Arrange
    const payload = undefined as unknown as NewAuthPayload;

    // Action and Assert
    expect(() => new NewAuth(payload)).toThrowError(
      'NEW_AUTH.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      accessToken: 'accessToken',
    } as NewAuthPayload;

    // Action and Assert
    expect(() => new NewAuth(payload)).toThrowError(
      'NEW_AUTH.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      accessToken: 123,
      refreshToken: true,
    } as unknown as NewAuthPayload;

    // Action and Assert
    expect(() => new NewAuth(payload)).toThrowError(
      'NEW_AUTH.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create NewAuth object correctly', () => {
    // Arrange
    const payload = {
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
    };

    // Action
    const newAuth = new NewAuth(payload);

    // Assert
    expect(newAuth.accessToken).toEqual(payload.accessToken);
    expect(newAuth.refreshToken).toEqual(payload.refreshToken);
  });
});
