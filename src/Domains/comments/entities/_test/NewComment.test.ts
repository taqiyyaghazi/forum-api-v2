import { describe, expect, it } from 'vitest';
import NewComment from '../NewComment.js';

interface NewCommentPayload {
  content: string;
  threadId: string;
  owner: string;
}

describe('NewComment entity', () => {
  it('should throw error when payload is undefined', () => {
    // Arrange
    const payload = undefined as unknown as NewCommentPayload;

    // Action and Assert
    expect(() => new NewComment(payload)).toThrowError(
      'NEW_COMMENT.NOT_CONTAIN_PAYLOAD',
    );
  });

  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'sebuah comment',
      threadId: 'thread-123',
    } as NewCommentPayload;

    // Action and Assert
    expect(() => new NewComment(payload)).toThrowError(
      'NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 123,
      threadId: 'thread-123',
      owner: {},
    } as unknown as NewCommentPayload;

    // Action and Assert
    expect(() => new NewComment(payload)).toThrowError(
      'NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create NewComment object correctly', () => {
    // Arrange
    const payload: NewCommentPayload = {
      content: 'sebuah comment',
      threadId: 'thread-123',
      owner: 'user-123',
    };

    // Action
    const newComment = new NewComment(payload);

    // Assert
    expect(newComment.content).toEqual('sebuah comment');
    expect(newComment.threadId).toEqual('thread-123');
    expect(newComment.owner).toEqual('user-123');
  });
});
