import { describe, expect, it } from 'vitest';
import CommentDetail, { CommentDetailPayload } from '../CommentDetail.js';

describe('CommentDetail entity', () => {
  it('should throw error when payload is undefined', () => {
    // Arrange
    const payload = undefined as unknown as CommentDetailPayload;

    // Action and Assert
    expect(() => new CommentDetail(payload)).toThrowError(
      'COMMENT_DETAIL.NOT_CONTAIN_PAYLOAD',
    );
  });

  it('should throw error when payload does not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
    } as CommentDetailPayload;

    // Action & Assert
    expect(() => new CommentDetail(payload)).toThrowError(
      'COMMENT_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      username: 'johndoe',
      date: '2021-08-08T07:22:33.555Z',
      content: 'sebuah comment',
      isDeleted: false,
      replies: [],
    } as unknown as CommentDetailPayload;

    // Action & Assert
    expect(() => new CommentDetail(payload)).toThrowError(
      'COMMENT_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create commentDetail object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date: new Date(),
      content: 'sebuah comment',
      isDeleted: false,
      replies: [],
    };

    // Action
    const commentDetail = new CommentDetail(payload);

    // Assert
    expect(commentDetail).toBeInstanceOf(CommentDetail);
    expect(commentDetail.id).toEqual(payload.id);
    expect(commentDetail.username).toEqual(payload.username);
    expect(commentDetail.date).toEqual(payload.date);
    expect(commentDetail.content).toEqual(payload.content);
    expect(commentDetail.replies).toEqual(payload.replies);
  });

  it('should create deleted commentDetail object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'johndoe',
      date: new Date(),
      content: 'sebuah comment',
      isDeleted: true,
      replies: [],
    };

    // Action
    const commentDetail = new CommentDetail(payload);

    // Assert
    expect(commentDetail).toBeInstanceOf(CommentDetail);
    expect(commentDetail.id).toEqual(payload.id);
    expect(commentDetail.username).toEqual(payload.username);
    expect(commentDetail.date).toEqual(payload.date);
    expect(commentDetail.content).toEqual('**komentar telah dihapus**');
  });
});
