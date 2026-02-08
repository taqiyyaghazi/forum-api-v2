import { describe, expect, it } from 'vitest';
import LikeRepository from '../LikeRepository';

describe('LikeRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const likeRepository = new LikeRepository();

    // Action and Assert
    await expect(
      likeRepository.addLike('user-123', 'comment-123'),
    ).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(
      likeRepository.deleteLike('user-123', 'comment-123'),
    ).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(
      likeRepository.checkLikeStatus('user-123', 'comment-123'),
    ).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
