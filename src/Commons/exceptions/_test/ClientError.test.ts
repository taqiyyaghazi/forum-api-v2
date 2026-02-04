import { describe, expect, it } from 'vitest';
import ClientError from '../ClientError.js';

// Create a concrete implementation for testing since ClientError is abstract
class TestClientError extends ClientError {
  constructor(message: string, statusCode?: number) {
    super(message, statusCode);
  }
}

describe('ClientError', () => {
  it('should create ClientError correctly with default status code', () => {
    // Arrange & Action
    const clientError = new TestClientError('client error!');

    // Assert
    expect(clientError).toBeInstanceOf(ClientError);
    expect(clientError).toBeInstanceOf(Error);
    expect(clientError.statusCode).toEqual(400);
    expect(clientError.message).toEqual('client error!');
    expect(clientError.name).toEqual('ClientError');
  });

  it('should create ClientError correctly with custom status code', () => {
    // Arrange & Action
    const clientError = new TestClientError('client error!', 404);

    // Assert
    expect(clientError).toBeInstanceOf(ClientError);
    expect(clientError).toBeInstanceOf(Error);
    expect(clientError.statusCode).toEqual(404);
    expect(clientError.message).toEqual('client error!');
  });
});
