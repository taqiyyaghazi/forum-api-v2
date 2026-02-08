import { describe, expect, it, vi } from 'vitest';
import { DeleteReplyPayload } from '../../../Domains/replies/entities/DeleteReply.js';
import ReplyRepository from '../../../Domains/replies/ReplyRepository.js';
import DeleteReplyUseCase from '../DeleteReplyUseCase.js';

describe('DeleteReplyUseCase', () => {
  it('should throw error when reply not found', async () => {
    // Arrange
    const payload: DeleteReplyPayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      replyId: 'reply-123',
      owner: 'user-123',
    };

    const mockReplyRepository = new ReplyRepository();

    mockReplyRepository.checkReplyAvailability = vi
      .fn()
      .mockResolvedValue(false);
    mockReplyRepository.verifyReplyOwner = vi.fn().mockResolvedValue(true);
    mockReplyRepository.deleteReply = vi.fn().mockResolvedValue(undefined);

    const deleteReplyUseCase = new DeleteReplyUseCase(mockReplyRepository);

    // Action and Assert
    await expect(
      deleteReplyUseCase.execute(payload),
    ).rejects.toThrowError('DELETE_REPLY_USE_CASE.REPLY_NOT_FOUND');
  });

  it('should throw error when reply not owner', async () => {
    // Arrange
    const payload: DeleteReplyPayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      replyId: 'reply-123',
      owner: 'user-123',
    };

    const mockReplyRepository = new ReplyRepository();

    mockReplyRepository.checkReplyAvailability = vi
      .fn()
      .mockResolvedValue(true);
    mockReplyRepository.verifyReplyOwner = vi.fn().mockResolvedValue(false);

    const deleteReplyUseCase = new DeleteReplyUseCase(mockReplyRepository);

    // Action and Assert
    await expect(
      deleteReplyUseCase.execute(payload),
    ).rejects.toThrowError('DELETE_REPLY_USE_CASE.REPLY_NOT_OWNER');
  });

  it('should delete reply correctly', async () => {
    // Arrange
    const payload: DeleteReplyPayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      replyId: 'reply-123',
      owner: 'user-123',
    };

    const mockReplyRepository = new ReplyRepository();

    mockReplyRepository.checkReplyAvailability = vi
      .fn()
      .mockResolvedValue(true);
    mockReplyRepository.verifyReplyOwner = vi.fn().mockResolvedValue(true);
    mockReplyRepository.deleteReply = vi.fn().mockResolvedValue(undefined);

    const deleteReplyUseCase = new DeleteReplyUseCase(mockReplyRepository);

    // Action and Assert
    await deleteReplyUseCase.execute(payload);

    expect(mockReplyRepository.checkReplyAvailability).toHaveBeenCalledWith(
      'reply-123',
      'comment-123',
      'thread-123',
    );
    expect(mockReplyRepository.verifyReplyOwner).toHaveBeenCalledWith(
      'reply-123',
      'user-123',
    );
    expect(mockReplyRepository.deleteReply).toHaveBeenCalledWith('reply-123');
  });
});
