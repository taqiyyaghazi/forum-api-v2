import { describe, expect, it } from 'vitest';
import NewReply, { NewReplyPayload } from '../NewReply';

describe('NewReply entity', () => {
  it('should throw error when payload does not contain needed property', () => {
    // Arrange
    const payload = {} as NewReplyPayload;

    // Action & Assert
    expect(() => new NewReply(payload)).toThrowError(
      'NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 123,
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: {},
    } as unknown as NewReplyPayload;

    // Action & Assert
    expect(() => new NewReply(payload)).toThrowError(
      'NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create NewReply object correctly', () => {
    // Arrange
    const payload: NewReplyPayload = {
      content: 'sebuah reply',
    };

    // Action
    const newReply = new NewReply(payload);

    // Assert
    expect(newReply.content).toEqual('sebuah reply');
  });
});
