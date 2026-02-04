import { describe, expect, it } from 'vitest';
import InvariantError from '../InvariantError.js';
import ClientError from '../ClientError.js';

describe('InvariantError', () => {
  it('should create InvariantError correctly', () => {
    // Arrange & Action
    const invariantError = new InvariantError('invariant error!');

    // Assert
    expect(invariantError).toBeInstanceOf(InvariantError);
    expect(invariantError).toBeInstanceOf(ClientError);
    expect(invariantError).toBeInstanceOf(Error);
    expect(invariantError.statusCode).toEqual(400);
    expect(invariantError.message).toEqual('invariant error!');
    expect(invariantError.name).toEqual('InvariantError');
  });
});
