import { describe, expect, it, vi } from 'vitest';
import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import ReplyRepository from '../../../Domains/replies/ReplyRepository.js';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import GetThreadDetailUseCase from '../GetThreadDetailUseCase.js';

describe('GetThreadDetailUseCase', () => {
  it('should throw error when thread not found', async () => {
    // Arrange
    const mockThreadRepository = {
      getThreadById: vi.fn().mockResolvedValue(null),
    } as unknown as ThreadRepository;
    const mockCommentRepository = {} as unknown as CommentRepository;
    const mockReplyRepository = {} as unknown as ReplyRepository;

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
    const threadId = 'thread-123';
    const firstCommentId = 'comment-12332323';
    const secondCommentId = 'comment-12523232';
    const firstReplyId = 'reply-12332323';
    const secondReplyId = 'reply-12523232';
    const expectedDetailThread = {
      id: threadId,
      username: 'ghazi',
      title: 'Judul',
      body: 'Body thread',
      date: '2021-01-01',
      comments: [
        {
          id: firstCommentId,
          username: 'johndoe',
          date: '2021-08-08T07:22:33.555Z',
          content: 'sebuah comment',
          replies: [
            {
              id: firstReplyId,
              username: 'johndoe',
              date: '2021-08-08T07:22:33.555Z',
              content: 'sebuah reply',
            },
            {
              id: secondReplyId,
              username: 'dicoding',
              date: '2021-08-08T07:26:21.338Z',
              content: '**balasan telah dihapus**',
            },
          ],
        },
        {
          id: secondCommentId,
          username: 'dicoding',
          date: '2021-08-08T07:26:21.338Z',
          content: '**komentar telah dihapus**',
          replies: [
            {
              id: firstReplyId,
              username: 'johndoe',
              date: '2021-08-08T07:22:33.555Z',
              content: 'sebuah reply',
            },
            {
              id: secondReplyId,
              username: 'dicoding',
              date: '2021-08-08T07:26:21.338Z',
              content: '**balasan telah dihapus**',
            },
          ],
        },
      ],
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.getThreadById = vi.fn().mockImplementation(() =>
      Promise.resolve({
        id: threadId,
        username: 'ghazi',
        title: 'Judul',
        body: 'Body thread',
        date: '2021-01-01',
      }),
    );

    mockCommentRepository.getCommentsByThreadId = vi
      .fn()
      .mockImplementation(() =>
        Promise.resolve([
          {
            id: firstCommentId,
            username: 'johndoe',
            date: '2021-08-08T07:22:33.555Z',
            content: 'sebuah comment',
            isDeleted: false,
          },
          {
            id: secondCommentId,
            username: 'dicoding',
            date: '2021-08-08T07:26:21.338Z',
            content: 'komentar yang dihapus',
            isDeleted: true,
          },
        ]),
      );

    mockReplyRepository.getRepliesByThreadId = vi.fn().mockImplementation(() =>
      Promise.resolve([
        {
          id: firstReplyId,
          username: 'johndoe',
          date: '2021-08-08T07:22:33.555Z',
          content: 'sebuah reply',
          isDeleted: false,
          commentId: firstCommentId,
        },
        {
          id: secondReplyId,
          username: 'dicoding',
          date: '2021-08-08T07:26:21.338Z',
          content: 'reply yang sudah dihapus',
          isDeleted: true,
          commentId: firstCommentId,
        },
      ]),
    );

    const getThreadDetailUseCase = new GetThreadDetailUseCase(
      mockThreadRepository,
      mockCommentRepository,
      mockReplyRepository,
    );

    const threadDetail = await getThreadDetailUseCase.execute(threadId);

    expect(threadDetail).toStrictEqual(expectedDetailThread);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(
      threadId,
    );
    expect(mockReplyRepository.getRepliesByThreadId).toBeCalledWith(threadId);
  });
});
