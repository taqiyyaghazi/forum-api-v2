import { describe, expect, it, vi } from 'vitest';
import CommentRepository from '../../../Domains/comments/CommentRepository';
import ThreadRepository from '../../../Domains/threads/ThreadRepository';
import DeleteCommentUseCase from '../DeleteCommentUseCase';
import { DeleteCommentPayload } from '../../../Domains/comments/entities/DeleteComment';

describe('DeleteCommentUseCase', () => {
  it('should throw error when thread not found', async () => {
    // Arrange
    const payload: DeleteCommentPayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    const mockCommentRepository = new CommentRepository();

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.verifyThreadExists = vi.fn().mockResolvedValue(false);

    const deleteCommentUseCase = new DeleteCommentUseCase(
      mockThreadRepository,
      mockCommentRepository,
    );

    // Action and Assert
    await expect(deleteCommentUseCase.execute(payload)).rejects.toThrowError(
      'DELETE_COMMENT_USE_CASE.THREAD_NOT_FOUND',
    );
  });

  it('should throw error when comment not found', async () => {
    // Arrange
    const payload: DeleteCommentPayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    const mockCommentRepository = new CommentRepository();

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.verifyThreadExists = vi.fn().mockResolvedValue(true);
    mockCommentRepository.verifyCommentAvailability = vi
      .fn()
      .mockResolvedValue(false);

    const deleteCommentUseCase = new DeleteCommentUseCase(
      mockThreadRepository,
      mockCommentRepository,
    );

    // Action and Assert
    await expect(deleteCommentUseCase.execute(payload)).rejects.toThrowError(
      'DELETE_COMMENT_USE_CASE.COMMENT_NOT_FOUND',
    );
  });

  it('should throw error when comment not owner', async () => {
    // Arrange
    const payload: DeleteCommentPayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    const mockCommentRepository = new CommentRepository();

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.verifyThreadExists = vi.fn().mockResolvedValue(true);
    mockCommentRepository.verifyCommentAvailability = vi
      .fn()
      .mockResolvedValue(true);
    mockCommentRepository.verifyCommentOwner = vi.fn().mockResolvedValue(false);

    const deleteCommentUseCase = new DeleteCommentUseCase(
      mockThreadRepository,
      mockCommentRepository,
    );

    // Action and Assert
    await expect(deleteCommentUseCase.execute(payload)).rejects.toThrowError(
      'DELETE_COMMENT_USE_CASE.COMMENT_NOT_OWNER',
    );
  });

  it('should delete comment correctly', async () => {
    // Arrange
    const payload: DeleteCommentPayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    const mockCommentRepository = new CommentRepository();

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.verifyThreadExists = vi.fn().mockResolvedValue(true);
    mockCommentRepository.verifyCommentAvailability = vi
      .fn()
      .mockResolvedValue(true);
    mockCommentRepository.verifyCommentOwner = vi.fn().mockResolvedValue(true);
    mockCommentRepository.deleteComment = vi.fn().mockResolvedValue(undefined);

    const deleteCommentUseCase = new DeleteCommentUseCase(
      mockThreadRepository,
      mockCommentRepository,
    );

    // Action and Assert
    await deleteCommentUseCase.execute(payload);

    expect(mockThreadRepository.verifyThreadExists).toHaveBeenCalledWith(
      'thread-123',
    );
    expect(
      mockCommentRepository.verifyCommentAvailability,
    ).toHaveBeenCalledWith('comment-123', 'thread-123');
    expect(mockCommentRepository.verifyCommentOwner).toHaveBeenCalledWith(
      'comment-123',
      'user-123',
    );
    expect(mockCommentRepository.deleteComment).toHaveBeenCalledWith(
      'comment-123',
    );
  });
});
