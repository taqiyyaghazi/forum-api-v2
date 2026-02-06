import { describe, expect, it } from 'vitest';
import ThreadDetail, { ThreadDetailPayload } from '../ThreadDetail.js';

describe('ThreadDetail entity', () => {
  it('should throw error when payload is undefined', () => {
    // Arrange
    const payload = undefined as unknown as ThreadDetailPayload;

    // Action and Assert
    expect(() => new ThreadDetail(payload)).toThrowError(
      'THREAD_DETAIL.NOT_CONTAIN_PAYLOAD',
    );
  });

  it('should throw error when payload does not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'sebuah thread',
    } as ThreadDetailPayload;

    // Action & Assert
    expect(() => new ThreadDetail(payload)).toThrowError(
      'THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
      comments: [],
    } as unknown as ThreadDetailPayload;

    // Action & Assert
    expect(() => new ThreadDetail(payload)).toThrowError(
      'THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create threadDetail object correctly', () => {
    // Arrange
    const payload: ThreadDetailPayload = {
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: new Date(),
      username: 'dicoding',
      comments: [],
    };

    // Action
    const threadDetail = new ThreadDetail(payload);

    // Assert
    expect(threadDetail).toBeInstanceOf(ThreadDetail);
    expect(threadDetail.id).toEqual(payload.id);
    expect(threadDetail.title).toEqual(payload.title);
    expect(threadDetail.body).toEqual(payload.body);
    expect(threadDetail.date).toEqual(payload.date);
    expect(threadDetail.username).toEqual(payload.username);
    expect(threadDetail.comments).toEqual(payload.comments);
  });
});
