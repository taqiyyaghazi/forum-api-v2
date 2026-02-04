import { describe, expect, it } from 'vitest';
import NotFoundError from '../NotFoundError.js';
import ClientError from '../ClientError.js';

describe('NotFoundError', () => {
  it('should create NotFoundError correctly', () => {
    // Arrange & Action
    const notFoundError = new NotFoundError('not found error!');

    // Assert
    expect(notFoundError).toBeInstanceOf(NotFoundError);
    expect(notFoundError).toBeInstanceOf(ClientError);
    expect(notFoundError).toBeInstanceOf(Error);
    expect(notFoundError.statusCode).toEqual(404);
    expect(notFoundError.message).toEqual('not found error!');
    expect(notFoundError.name).toEqual('NotFoundError');
  });
});
