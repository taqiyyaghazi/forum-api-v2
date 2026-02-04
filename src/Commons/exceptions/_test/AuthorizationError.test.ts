import { describe, expect, it } from 'vitest';
import AuthorizationError from '../AuthorizationError.js';
import ClientError from '../ClientError.js';

describe('AuthorizationError', () => {
  it('should create AuthorizationError correctly', () => {
    // Arrange & Action
    const authorizationError = new AuthorizationError('authorization error!');

    // Assert
    expect(authorizationError).toBeInstanceOf(AuthorizationError);
    expect(authorizationError).toBeInstanceOf(ClientError);
    expect(authorizationError).toBeInstanceOf(Error);
    expect(authorizationError.statusCode).toEqual(403);
    expect(authorizationError.message).toEqual('authorization error!');
    expect(authorizationError.name).toEqual('AuthorizationError');
  });
});
