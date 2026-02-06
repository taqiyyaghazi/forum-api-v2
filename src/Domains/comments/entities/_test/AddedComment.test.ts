import { describe, expect, it } from 'vitest';
import AddedComment from '../AddedComment.js';

interface AddedCommentPayload {
  id: string;
  content: string;
  owner: string;
}

describe('AddedComment entity', () => {
  it('should throw error when payload is undefined', () => {
    // Arrange
    const payload = undefined as unknown as AddedCommentPayload;

    // Action and Assert
    expect(() => new AddedComment(payload)).toThrowError(
      'ADDED_COMMENT.NOT_CONTAIN_PAYLOAD',
    );
  });

  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'sebuah comment',
    } as AddedCommentPayload;

    // Action and Assert
    expect(() => new AddedComment(payload)).toThrowError(
      'ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      content: 'sebuah comment',
      owner: {},
    } as unknown as AddedCommentPayload;

    // Action and Assert
    expect(() => new AddedComment(payload)).toThrowError(
      'ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create AddedComment object correctly', () => {
    // Arrange
    const payload: AddedCommentPayload = {
      id: 'comment-123',
      content: 'sebuah comment',
      owner: 'user-123',
    };

    // Action
    const addedComment = new AddedComment(payload);

    // Assert
    expect(addedComment.id).toEqual('comment-123');
    expect(addedComment.content).toEqual('sebuah comment');
    expect(addedComment.owner).toEqual('user-123');
  });
});
