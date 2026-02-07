import { describe, expect, it } from 'vitest';
import DeleteComment, { DeleteCommentPayload } from '../DeleteComment.js';

describe('DeleteComment entity', () => {
  it('should throw error when payload is undefined', () => {
    // Arrange
    const payload = undefined as unknown as DeleteCommentPayload;

    // Action and Assert
    expect(() => new DeleteComment(payload)).toThrowError(
      'DELETE_COMMENT.NOT_CONTAIN_PAYLOAD',
    );
  });

  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
    } as unknown as DeleteCommentPayload;

    // Action and Assert
    expect(() => new DeleteComment(payload)).toThrowError(
      'DELETE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      threadId: 123,
      commentId: 'comment-123',
      owner: 'user-123',
    } as unknown as DeleteCommentPayload;

    // Action and Assert
    expect(() => new DeleteComment(payload)).toThrowError(
      'DELETE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create deleteComment object correctly', () => {
    // Arrange
    const payload: DeleteCommentPayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    // Action
    const deleteComment = new DeleteComment(payload);

    // Assert
    expect(deleteComment.threadId).toEqual('thread-123');
    expect(deleteComment.commentId).toEqual('comment-123');
    expect(deleteComment.owner).toEqual('user-123');
  });
});
