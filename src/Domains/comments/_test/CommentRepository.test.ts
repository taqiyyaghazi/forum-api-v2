import { describe, expect, it } from 'vitest';
import CommentRepository from '../CommentRepository.js';
import NewComment from '../entities/NewComment.js';

describe('CommentRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const commentRepository = new CommentRepository();
    const newComment = new NewComment({
      content: 'sebuah comment',
      threadId: 'thread-123',
      owner: 'user-123',
    });

    // Action and Assert
    await expect(commentRepository.addComment(newComment)).rejects.toThrowError(
      'COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );
    await expect(
      commentRepository.getCommentsByThreadId('thread-123'),
    ).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(
      commentRepository.deleteComment('comment-123'),
    ).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(
      commentRepository.verifyCommentOwner('comment-123', 'user-123'),
    ).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(
      commentRepository.isCommentExist('comment-123'),
    ).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
