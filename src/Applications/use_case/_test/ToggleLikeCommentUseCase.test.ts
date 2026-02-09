import { describe, expect, it, vi } from 'vitest';
import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import LikeRepository from '../../../Domains/likes/LikeRepository.js';
import ToggleLikeCommentUseCase, {
  ToggleLikeCommentUseCasePayload,
} from '../ToggleLikeCommentUseCase.js';

describe('ToggleLikeCommentUseCase', () => {
  it('should throw error if comment is not found', async () => {
    // Arrange
    const payload: ToggleLikeCommentUseCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      userId: 'user-123',
    };

    const mockLikeRepository = new LikeRepository();
    const mockCommentRepository = new CommentRepository();

    mockCommentRepository.verifyCommentAvailability = vi
      .fn()
      .mockResolvedValue(false);

    const toggleLikeCommentUseCase = new ToggleLikeCommentUseCase(
      mockLikeRepository,
      mockCommentRepository,
    );

    // Action & Assert
    await expect(toggleLikeCommentUseCase.execute(payload)).rejects.toThrow(
      'TOGGLE_LIKE_COMMENT_USE_CASE.COMMENT_NOT_FOUND',
    );
  });

  it('should like the comment if not liked', async () => {
    // Arrange
    const payload: ToggleLikeCommentUseCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      userId: 'user-123',
    };

    const mockLikeRepository = new LikeRepository();
    const mockCommentRepository = new CommentRepository();

    mockCommentRepository.verifyCommentAvailability = vi
      .fn()
      .mockResolvedValue(true);
    mockLikeRepository.checkLikeStatus = vi.fn().mockResolvedValue(false);
    mockLikeRepository.addLike = vi.fn().mockResolvedValue(undefined);
    mockLikeRepository.deleteLike = vi.fn().mockResolvedValue(undefined);

    const toggleLikeCommentUseCase = new ToggleLikeCommentUseCase(
      mockLikeRepository,
      mockCommentRepository,
    );

    // Action
    await toggleLikeCommentUseCase.execute(payload);

    // Assert
    expect(mockCommentRepository.verifyCommentAvailability).toBeCalledWith(
      payload.commentId,
      payload.threadId,
    );
    expect(mockLikeRepository.checkLikeStatus).toBeCalledWith(
      payload.userId,
      payload.commentId,
    );
    expect(mockLikeRepository.addLike).toBeCalledWith(
      payload.userId,
      payload.commentId,
    );
    expect(mockLikeRepository.deleteLike).not.toBeCalled();
  });

  it('should unlike the comment if liked', async () => {
    // Arrange
    const payload: ToggleLikeCommentUseCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      userId: 'user-123',
    };

    const mockLikeRepository = new LikeRepository();
    const mockCommentRepository = new CommentRepository();

    mockCommentRepository.verifyCommentAvailability = vi
      .fn()
      .mockResolvedValue(true);
    mockLikeRepository.checkLikeStatus = vi.fn().mockResolvedValue(true);
    mockLikeRepository.deleteLike = vi.fn().mockResolvedValue(undefined);
    mockLikeRepository.addLike = vi.fn().mockResolvedValue(undefined);

    const toggleLikeCommentUseCase = new ToggleLikeCommentUseCase(
      mockLikeRepository,
      mockCommentRepository,
    );

    // Action
    await toggleLikeCommentUseCase.execute(payload);

    // Assert
    expect(mockCommentRepository.verifyCommentAvailability).toBeCalledWith(
      payload.commentId,
      payload.threadId,
    );
    expect(mockLikeRepository.checkLikeStatus).toBeCalledWith(
      payload.userId,
      payload.commentId,
    );
    expect(mockLikeRepository.deleteLike).toBeCalledWith(
      payload.userId,
      payload.commentId,
    );
    expect(mockLikeRepository.addLike).not.toBeCalled();
  });
});
