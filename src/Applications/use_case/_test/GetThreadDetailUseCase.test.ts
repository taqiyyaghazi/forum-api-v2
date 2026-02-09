import { describe, expect, it, vi } from 'vitest';
import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import CommentDetail from '../../../Domains/comments/entities/CommentDetail.js';
import ReplyDetail from '../../../Domains/replies/entities/ReplyDetail.js';
import ReplyRepository from '../../../Domains/replies/ReplyRepository.js';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import GetThreadDetailUseCase from '../GetThreadDetailUseCase.js';
import ThreadDetail from '../../../Domains/threads/entities/ThreadDetail.js';

describe('GetThreadDetailUseCase', () => {
  it('should throw error when thread not found', async () => {
    // Arrange
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.getThreadById = vi.fn().mockResolvedValue(null);

    const getThreadDetailUseCase = new GetThreadDetailUseCase(
      mockThreadRepository,
      mockCommentRepository,
      mockReplyRepository,
    );

    // Action & Assert
    await expect(
      getThreadDetailUseCase.execute('thread-123'),
    ).rejects.toThrowError('GET_THREAD_DETAIL_USE_CASE.THREAD_NOT_FOUND');
    expect(mockThreadRepository.getThreadById).toBeCalledWith('thread-123');
  });

  it('should orchestrate the get thread detail action correctly', async () => {
    // Arrange
    const mockDate = new Date();
    const mockThread = {
      id: 'thread-123',
      username: 'ghazi',
      title: 'Judul',
      body: 'Body thread',
      date: mockDate,
    };
    const mockComments = [
      {
        id: 'comment-1',
        username: 'johndoe',
        date: mockDate,
        content: 'sebuah comment',
        isDeleted: false,
        likeCount: 0,
      },
      {
        id: 'comment-2',
        username: 'dicoding',
        date: mockDate,
        content: 'komentar yang dihapus',
        isDeleted: true,
        likeCount: 0,
      },
    ];
    const mockReplies = [
      {
        id: 'reply-1',
        username: 'johndoe',
        date: mockDate,
        content: 'sebuah reply',
        isDeleted: false,
        commentId: 'comment-1',
      },
      {
        id: 'reply-2',
        username: 'dicoding',
        date: mockDate,
        content: 'reply yang sudah dihapus',
        isDeleted: true,
        commentId: 'comment-1',
      },
      {
        id: 'reply-3',
        username: 'johndoe',
        date: mockDate,
        content: 'sebuah reply',
        isDeleted: false,
        commentId: 'comment-2',
      },
      {
        id: 'reply-4',
        username: 'dicoding',
        date: mockDate,
        content: 'reply yang sudah dihapus',
        isDeleted: true,
        commentId: 'comment-2',
      },
    ];

    const expectedThreadDetail = new ThreadDetail({
      id: 'thread-123',
      username: 'ghazi',
      title: 'Judul',
      body: 'Body thread',
      date: mockDate,
      comments: [
        new CommentDetail({
          id: 'comment-1',
          username: 'johndoe',
          date: mockDate,
          content: 'sebuah comment',
          isDeleted: false,
          likeCount: 0,
          replies: [
            new ReplyDetail({
              id: 'reply-1',
              username: 'johndoe',
              date: mockDate,
              content: 'sebuah reply',
              isDeleted: false,
            }),
            new ReplyDetail({
              id: 'reply-2',
              username: 'dicoding',
              date: mockDate,
              content: 'reply yang sudah dihapus',
              isDeleted: true,
            }),
          ],
        }),
        new CommentDetail({
          id: 'comment-2',
          username: 'dicoding',
          date: mockDate,
          content: 'komentar yang dihapus',
          isDeleted: true,
          likeCount: 0,
          replies: [
            new ReplyDetail({
              id: 'reply-3',
              username: 'johndoe',
              date: mockDate,
              content: 'sebuah reply',
              isDeleted: false,
            }),
            new ReplyDetail({
              id: 'reply-4',
              username: 'dicoding',
              date: mockDate,
              content: 'reply yang sudah dihapus',
              isDeleted: true,
            }),
          ],
        }),
      ],
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.getThreadById = vi.fn().mockResolvedValue(mockThread);

    mockCommentRepository.getCommentsByThreadId = vi
      .fn()
      .mockResolvedValue(mockComments);

    mockReplyRepository.getRepliesByThreadId = vi
      .fn()
      .mockResolvedValue(mockReplies);

    const getThreadDetailUseCase = new GetThreadDetailUseCase(
      mockThreadRepository,
      mockCommentRepository,
      mockReplyRepository,
    );

    const threadDetail = await getThreadDetailUseCase.execute('thread-123');

    // Assert
    expect(threadDetail).toStrictEqual(expectedThreadDetail);
    expect(threadDetail).toBeInstanceOf(ThreadDetail);
    expect(mockThreadRepository.getThreadById).toBeCalledWith('thread-123');
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(
      'thread-123',
    );
    expect(mockReplyRepository.getRepliesByThreadId).toBeCalledWith(
      'thread-123',
    );
  });
});
