import { describe, expect, it } from 'vitest';
import RefreshToken, { RefreshTokenPayload } from '../RefreshToken.js';

describe('RefreshToken entity', () => {
  it('should throw error when payload is undefined', () => {
    // Arrange
    const payload = undefined as unknown as RefreshTokenPayload;

    // Action and Assert
    expect(() => new RefreshToken(payload)).toThrowError(
      'REFRESH_TOKEN.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {} as RefreshTokenPayload;

    // Action and Assert
    expect(() => new RefreshToken(payload)).toThrowError(
      'REFRESH_TOKEN.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      refreshToken: 123,
    } as unknown as RefreshTokenPayload;

    // Action and Assert
    expect(() => new RefreshToken(payload)).toThrowError(
      'REFRESH_TOKEN.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create RefreshToken object correctly', () => {
    // Arrange
    const payload = {
      refreshToken: 'refresh_token',
    };

    // Action
    const refreshToken = new RefreshToken(payload);

    // Assert
    expect(refreshToken.refreshToken).toEqual(payload.refreshToken);
  });
});
