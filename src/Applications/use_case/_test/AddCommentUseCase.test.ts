import { describe, expect, it, vi } from 'vitest';
import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import AddedComment from '../../../Domains/comments/entities/AddedComment.js';
import NewComment from '../../../Domains/comments/entities/NewComment.js';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import AddCommentUseCase, {
  AddCommentUseCasePayload,
} from '../AddCommentUseCase.js';

describe('AddCommentUseCase', () => {
  it('should throw error when thread is not found', async () => {
    // Arrange
    const payload: AddCommentUseCasePayload = {
      content: 'sebuah comment',
      threadId: 'thread-123',
      owner: 'user-123',
    };

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.verifyThreadExists = vi.fn().mockResolvedValue(false);
    mockCommentRepository.addComment = vi.fn().mockResolvedValue(null);

    const addCommentUseCase = new AddCommentUseCase(
      mockCommentRepository,
      mockThreadRepository,
    );

    // Action and Assert
    await expect(addCommentUseCase.execute(payload)).rejects.toThrowError(
      'ADD_COMMENT_USE_CASE.THREAD_NOT_FOUND',
    );
    expect(mockThreadRepository.verifyThreadExists).toBeCalledWith(null);
    expect(mockCommentRepository.addComment).not.toBeCalledWith(
      new NewComment({
        content: 'sebuah comment',
        threadId: 'thread-123',
        owner: 'user-123',
      }),
    );
  });

  it('should orchestrate the add comment action correctly', async () => {
    // Arrange
    const payload: AddCommentUseCasePayload = {
      content: 'sebuah comment',
      threadId: 'thread-123',
      owner: 'user-123',
    };

    const mockAddedComment = new AddedComment({
      id: 'comment-123',
      content: 'thread-123',
      owner: 'user-123',
    });

    const expectedAddedComment = new AddedComment({
      id: 'comment-123',
      content: 'thread-123',
      owner: 'user-123',
    });

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockCommentRepository.addComment = vi
      .fn()
      .mockResolvedValue(mockAddedComment);
    mockThreadRepository.verifyThreadExists = vi.fn().mockResolvedValue(true);

    const addCommentUseCase = new AddCommentUseCase(
      mockCommentRepository,
      mockThreadRepository,
    );

    // Action
    const result = await addCommentUseCase.execute(payload);

    // Assert
    expect(result).toBeInstanceOf(AddedComment);
    expect(result).toStrictEqual(expectedAddedComment);
    expect(mockThreadRepository.verifyThreadExists).toBeCalledWith(
      payload.threadId,
    );
    expect(mockCommentRepository.addComment).toBeCalledWith(
      new NewComment({
        content: payload.content,
        threadId: payload.threadId,
        owner: payload.owner,
      }),
    );
  });
});
