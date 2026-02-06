import { describe, expect, it } from 'vitest';
import AddedReply, { AddedReplyPayload } from '../AddedReply';

describe('AddedReply entity', () => {
  it('should throw error when payload does not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
    } as AddedReplyPayload;

    // Action & Assert
    expect(() => new AddedReply(payload)).toThrowError(
      'ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      content: 'sebuah reply',
      owner: {},
    } as unknown as AddedReplyPayload;

    // Action & Assert
    expect(() => new AddedReply(payload)).toThrowError(
      'ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create AddedReply object correctly', () => {
    // Arrange
    const payload: AddedReplyPayload = {
      id: 'reply-123',
      content: 'sebuah reply',
      owner: 'user-123',
    };

    // Action
    const addedReply = new AddedReply(payload);

    // Assert
    expect(addedReply.id).toEqual('reply-123');
    expect(addedReply.content).toEqual('sebuah reply');
    expect(addedReply.owner).toEqual('user-123');
  });
});
