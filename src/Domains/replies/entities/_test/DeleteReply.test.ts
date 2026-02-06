import { describe, expect, it } from 'vitest';
import DeleteReply, { DeleteReplyPayload } from '../DeleteReply';

describe('DeleteReply entity', () => {
  it('should throw error when payload does not contain needed property', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
    } as DeleteReplyPayload;

    // Action & Assert
    expect(() => new DeleteReply(payload)).toThrowError(
      'DELETE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      threadId: 123,
      commentId: 'comment-123',
      replyId: 'reply-123',
      owner: {},
    } as unknown as DeleteReplyPayload;

    // Action & Assert
    expect(() => new DeleteReply(payload)).toThrowError(
      'DELETE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create DeleteReply object correctly', () => {
    // Arrange
    const payload: DeleteReplyPayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      replyId: 'reply-123',
      owner: 'user-123',
    };

    // Action
    const deleteReply = new DeleteReply(payload);

    // Assert
    expect(deleteReply.threadId).toEqual('thread-123');
    expect(deleteReply.commentId).toEqual('comment-123');
    expect(deleteReply.replyId).toEqual('reply-123');
    expect(deleteReply.owner).toEqual('user-123');
  });
});
