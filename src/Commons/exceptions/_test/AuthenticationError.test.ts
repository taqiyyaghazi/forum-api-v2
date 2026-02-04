import { describe, expect, it } from 'vitest';
import AuthenticationError from '../AuthenticationError.js';
import ClientError from '../ClientError.js';

describe('AuthenticationError', () => {
  it('should create AuthenticationError correctly', () => {
    // Arrange & Action
    const authenticationError = new AuthenticationError(
      'authentication error!',
    );

    // Assert
    expect(authenticationError).toBeInstanceOf(AuthenticationError);
    expect(authenticationError).toBeInstanceOf(ClientError);
    expect(authenticationError).toBeInstanceOf(Error);
    expect(authenticationError.statusCode).toEqual(401);
    expect(authenticationError.message).toEqual('authentication error!');
    expect(authenticationError.name).toEqual('AuthenticationError');
  });
});
