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
      likeCount: 0,
      replies: [],
    } as unknown as CommentDetailPayload;

    // Action & Assert
    expect(() => new CommentDetail(payload)).toThrowError(
      'COMMENT_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create commentDetail object correctly', () => {
    // Arrange
    const mockDate = new Date();
    const payload: CommentDetailPayload = {
      id: 'comment-123',
      username: 'dicoding',
      date: mockDate,
      content: 'sebuah comment',
      isDeleted: false,
      likeCount: 0,
      replies: [],
    };

    // Action
    const commentDetail = new CommentDetail(payload);

    // Assert
    expect(commentDetail).toBeInstanceOf(CommentDetail);
    expect(commentDetail.id).toEqual('comment-123');
    expect(commentDetail.username).toEqual('dicoding');
    expect(commentDetail.date).toEqual(mockDate);
    expect(commentDetail.content).toEqual('sebuah comment');
    expect(commentDetail.likeCount).toEqual(0);
    expect(commentDetail.replies).toEqual([]);
  });

  it('should create deleted commentDetail object correctly', () => {
    // Arrange
    const mockDate = new Date();
    const payload: CommentDetailPayload = {
      id: 'comment-123',
      username: 'johndoe',
      date: mockDate,
      content: 'sebuah comment',
      isDeleted: true,
      likeCount: 0,
      replies: [],
    };

    // Action
    const commentDetail = new CommentDetail(payload);

    // Assert
    expect(commentDetail).toBeInstanceOf(CommentDetail);
    expect(commentDetail.id).toEqual('comment-123');
    expect(commentDetail.username).toEqual('johndoe');
    expect(commentDetail.date).toEqual(mockDate);
    expect(commentDetail.content).toEqual('**komentar telah dihapus**');
  });
});
