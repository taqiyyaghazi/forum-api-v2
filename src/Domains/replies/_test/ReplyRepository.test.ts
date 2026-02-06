import { describe, expect, it } from 'vitest';
import NewReply from '../entities/NewReply';
import ReplyRepository from '../ReplyRepository';

describe('ReplyRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const replyRepository = new ReplyRepository();
    const newReply = new NewReply({
      content: 'sebuah reply',
    });

    // Action and Assert
    await expect(
      replyRepository.addReply(newReply, 'comment-123', 'user-123'),
    ).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(
      replyRepository.getRepliesByThreadId('thread-123'),
    ).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(replyRepository.deleteReply('reply-123')).rejects.toThrowError(
      'REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );
    await expect(
      replyRepository.verifyReplyOwner('reply-123', 'user-123'),
    ).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(
      replyRepository.checkReplyAvailability(
        'reply-123',
        'comment-123',
        'thread-123',
      ),
    ).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
