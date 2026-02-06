import { describe, expect, it } from 'vitest';
import NewThread from '../NewThread.js';

interface NewThreadPayload {
  title: string;
  body: string;
  owner: string;
}

describe('NewThread entity', () => {
  it('should throw error when payload is undefined', () => {
    // Arrange
    const payload = undefined as unknown as NewThreadPayload;

    // Action and Assert
    expect(() => new NewThread(payload)).toThrowError(
      'NEW_THREAD.NOT_CONTAIN_PAYLOAD',
    );
  });

  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'A Thread Title',
      body: 'Thread body content',
    } as NewThreadPayload;

    // Action and Assert
    expect(() => new NewThread(payload)).toThrowError(
      'NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      title: 123,
      body: 'Thread body content',
      owner: {},
    } as unknown as NewThreadPayload;

    // Action and Assert
    expect(() => new NewThread(payload)).toThrowError(
      'NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create NewThread object correctly', () => {
    // Arrange
    const payload: NewThreadPayload = {
      title: 'A Thread Title',
      body: 'Thread body content',
      owner: 'user-123',
    };

    // Action
    const newThread = new NewThread(payload);

    // Assert
    expect(newThread.title).toEqual(payload.title);
    expect(newThread.body).toEqual(payload.body);
    expect(newThread.owner).toEqual(payload.owner);
  });
});
