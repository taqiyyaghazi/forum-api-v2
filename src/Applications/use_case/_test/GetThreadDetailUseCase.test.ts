import { describe, expect, it, vi } from 'vitest';
import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import CommentDetail from '../../../Domains/comments/entities/CommentDetail.js';
import ReplyDetail from '../../../Domains/replies/entities/ReplyDetail.js';
import ReplyRepository from '../../../Domains/replies/ReplyRepository.js';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import GetThreadDetailUseCase from '../GetThreadDetailUseCase.js';

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
      },
      {
        id: 'comment-2',
        username: 'dicoding',
        date: mockDate,
        content: 'komentar yang dihapus',
        isDeleted: true,
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

    expect(threadDetail.id).toBe('thread-123');
    expect(threadDetail.title).toBe('Judul');
    expect(threadDetail.body).toBe('Body thread');
    expect(threadDetail.date).toBe(mockDate);
    expect(threadDetail.username).toBe('ghazi');
    expect(threadDetail.comments).toHaveLength(2);
    expect(threadDetail.comments[0]).toBeInstanceOf(CommentDetail);
    expect(threadDetail.comments[1]).toBeInstanceOf(CommentDetail);
    expect(threadDetail.comments[0].replies).toHaveLength(2);
    expect(threadDetail.comments[0].replies[0]).toBeInstanceOf(ReplyDetail);
    expect(threadDetail.comments[0].replies[1]).toBeInstanceOf(ReplyDetail);
    expect(threadDetail.comments[1].replies).toHaveLength(2);
    expect(threadDetail.comments[1].replies[0]).toBeInstanceOf(ReplyDetail);
    expect(threadDetail.comments[1].replies[1]).toBeInstanceOf(ReplyDetail);
    expect(mockThreadRepository.getThreadById).toBeCalledWith('thread-123');
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(
      'thread-123',
    );
    expect(mockReplyRepository.getRepliesByThreadId).toBeCalledWith(
      'thread-123',
    );
  });
});
