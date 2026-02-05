import { describe, expect, it, vi } from 'vitest';
import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import AddCommentUseCase from '../AddCommentUseCase.js';

describe('AddCommentUseCase', () => {
  it('should throw error when thread is not found', async () => {
    // Arrange
    const payload = {
      content: 'sebuah comment',
      threadId: 'thread-123',
      owner: 'user-123',
    };

    const mockCommentRepository = {
      addComment: vi.fn(),
    } as unknown as CommentRepository;

    const mockThreadRepository = {
      verifyThreadExists: vi.fn().mockResolvedValue(false),
    } as unknown as ThreadRepository;

    const addCommentUseCase = new AddCommentUseCase(
      mockCommentRepository,
      mockThreadRepository,
    );

    // Action and Assert
    await expect(addCommentUseCase.execute(payload)).rejects.toThrowError(
      'ADD_COMMENT_USE_CASE.THREAD_NOT_FOUND',
    );
    expect(mockThreadRepository.verifyThreadExists).toBeCalledWith(
      payload.threadId,
    );
    expect(mockCommentRepository.addComment).not.toBeCalledWith(
      expect.objectContaining({
        content: payload.content,
        threadId: payload.threadId,
        owner: payload.owner,
      }),
    );
  });

  it('should orchestrate the add comment action correctly', async () => {
    // Arrange
    const payload = {
      content: 'sebuah comment',
      threadId: 'thread-123',
      owner: 'user-123',
    };

    const expectedAddedComment = {
      id: 'comment-123',
      content: payload.content,
      owner: payload.owner,
    };

    const mockCommentRepository = {
      addComment: vi.fn().mockResolvedValue(expectedAddedComment),
    } as unknown as CommentRepository;

    const mockThreadRepository = {
      verifyThreadExists: vi.fn().mockResolvedValue(true),
    } as unknown as ThreadRepository;

    const addCommentUseCase = new AddCommentUseCase(
      mockCommentRepository,
      mockThreadRepository,
    );

    // Action
    const result = await addCommentUseCase.execute(payload);

    // Assert
    expect(result).toEqual(expectedAddedComment);
    expect(mockThreadRepository.verifyThreadExists).toBeCalledWith(
      payload.threadId,
    );
    expect(mockCommentRepository.addComment).toBeCalledWith(
      expect.objectContaining({
        content: payload.content,
        threadId: payload.threadId,
        owner: payload.owner,
      }),
    );
  });
});
