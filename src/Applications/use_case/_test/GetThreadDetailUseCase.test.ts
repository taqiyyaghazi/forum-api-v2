import { describe, expect, it, vi } from 'vitest';
import GetThreadDetailUseCase from '../GetThreadDetailUseCase.js';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import ThreadDetail from '../../../Domains/threads/entities/ThreadDetail.js';
import CommentDetail from '../../../Domains/comments/entities/CommentDetail.js';

describe('GetThreadDetailUseCase', () => {
  it('should throw error when thread not found', async () => {
    // Arrange
    const mockThreadRepository = {
      getThreadById: vi.fn().mockResolvedValue(null),
    } as unknown as ThreadRepository;
    const mockCommentRepository = {} as unknown as CommentRepository;

    const getThreadDetailUseCase = new GetThreadDetailUseCase(
      mockThreadRepository,
      mockCommentRepository,
    );

    // Action & Assert
    await expect(
      getThreadDetailUseCase.execute('thread-123'),
    ).rejects.toThrowError('GET_THREAD_DETAIL_USE_CASE.THREAD_NOT_FOUND');
    expect(mockThreadRepository.getThreadById).toBeCalledWith('thread-123');
  });

  it('should orchestrate the get thread detail action correctly', async () => {
    // Arrange
    const threadId = 'thread-123';
    const mockThread = {
      id: threadId,
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: new Date(),
      username: 'dicoding',
    };

    const mockComments = [
      {
        id: 'comment-1',
        username: 'johndoe',
        date: new Date(),
        content: 'sebuah comment',
        isDeleted: false,
      },
      {
        id: 'comment-2',
        username: 'dicoding',
        date: new Date(),
        content: 'sebuah comment',
        isDeleted: true,
      },
    ];

    const mockThreadRepository = {
      getThreadById: vi.fn().mockResolvedValue(mockThread),
    } as unknown as ThreadRepository;

    const mockCommentRepository = {
      getCommentsByThreadId: vi.fn().mockResolvedValue(mockComments),
    } as unknown as CommentRepository;

    const getThreadDetailUseCase = new GetThreadDetailUseCase(
      mockThreadRepository,
      mockCommentRepository,
    );

    // Action
    const result = await getThreadDetailUseCase.execute(threadId);

    // Assert
    expect(result).toStrictEqual(
      new ThreadDetail({
        ...mockThread,
        comments: [
          new CommentDetail(mockComments[0]),
          new CommentDetail(mockComments[1]),
        ],
      }),
    );
    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(
      threadId,
    );
  });
});
