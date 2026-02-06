import { describe, expect, it } from 'vitest';
import ReplyDetail, { ReplyDetailPayload } from '../ReplyDetail';

describe('ReplyDetail entity', () => {
  it('should throw error when payload does not contain needed property', () => {
    // Arrange
    const payload = {} as ReplyDetailPayload;

    // Action & Assert
    expect(() => new ReplyDetail(payload)).toThrowError(
      'REPLY_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      content: 'sebuah reply',
      date: '2026-02-06T16:50:47.000Z',
      username: 'user-123',
    } as unknown as ReplyDetailPayload;

    // Action & Assert
    expect(() => new ReplyDetail(payload)).toThrowError(
      'REPLY_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create ReplyDetail object correctly', () => {
    // Arrange
    const mockDate = new Date();
    const payload: ReplyDetailPayload = {
      id: 'reply-123',
      content: 'sebuah reply',
      date: mockDate,
      username: 'user-123',
      isDeleted: false,
    };

    // Action
    const replyDetail = new ReplyDetail(payload);

    // Assert
    expect(replyDetail.id).toEqual('reply-123');
    expect(replyDetail.content).toEqual('sebuah reply');
    expect(replyDetail.date).toEqual(mockDate);
    expect(replyDetail.username).toEqual('user-123');
  });

  it('should create ReplyDetail object correctly when isDeleted is true', () => {
    // Arrange
    const mockDate = new Date();
    const payload: ReplyDetailPayload = {
      id: 'reply-123',
      content: 'sebuah reply',
      date: mockDate,
      username: 'user-123',
      isDeleted: true,
    };

    // Action
    const replyDetail = new ReplyDetail(payload);

    // Assert
    expect(replyDetail.id).toEqual('reply-123');
    expect(replyDetail.content).toEqual('**balasan telah dihapus**');
    expect(replyDetail.date).toEqual(mockDate);
    expect(replyDetail.username).toEqual('user-123');
  });
});
