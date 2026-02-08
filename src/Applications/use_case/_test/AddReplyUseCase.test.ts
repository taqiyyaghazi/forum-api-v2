import { describe, expect, it, vi } from 'vitest';
import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import AddedReply from '../../../Domains/replies/entities/AddedReply.js';
import NewReply from '../../../Domains/replies/entities/NewReply.js';
import ReplyRepository from '../../../Domains/replies/ReplyRepository.js';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import AddReplyUseCase, { AddReplyUseCasePayload } from '../AddReplyUseCase.js';

describe('AddReplyUseCase', () => {
  it('should create added reply correctly', async () => {
    // Arrange
    const payload: AddReplyUseCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      content: 'new reply',
      owner: 'user-123',
    };

    const mockAddedReply = new AddedReply({
      id: 'reply-123',
      content: 'new reply',
      owner: 'user-123',
    });

    const expectedAddedReply = new AddedReply({
      id: 'reply-123',
      content: 'new reply',
      owner: 'user-123',
    });

    const mockReplyRepository = new ReplyRepository();

    const mockCommentRepository = new CommentRepository();

    const mockThreadRepository = new ThreadRepository();

    mockReplyRepository.addReply = vi.fn().mockResolvedValue(mockAddedReply);
    mockCommentRepository.verifyCommentAvailability = vi
      .fn()
      .mockResolvedValue(true);
    mockThreadRepository.verifyThreadExists = vi.fn().mockResolvedValue(true);

    const addReplyUseCase = new AddReplyUseCase(
      mockReplyRepository,
      mockCommentRepository,
      mockThreadRepository,
    );

    // Action
    const addedReply = await addReplyUseCase.execute(payload);

    // Assert
    expect(addedReply).toBeInstanceOf(AddedReply);
    expect(addedReply).toStrictEqual(expectedAddedReply);
    expect(mockThreadRepository.verifyThreadExists).toHaveBeenCalledWith(
      'thread-123',
    );
    expect(
      mockCommentRepository.verifyCommentAvailability,
    ).toHaveBeenCalledWith('comment-123', 'thread-123');
    expect(mockReplyRepository.addReply).toHaveBeenCalledWith(
      new NewReply({ content: 'new reply' }),
      'comment-123',
      'user-123',
    );
  });

  it('should throw error when thread not found', async () => {
    // Arrange
    const payload: AddReplyUseCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      content: 'new reply',
      owner: 'user-123',
    };

    const mockReplyRepository = new ReplyRepository();

    const mockCommentRepository = new CommentRepository();

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.verifyThreadExists = vi.fn().mockResolvedValue(false);

    const addReplyUseCase = new AddReplyUseCase(
      mockReplyRepository,
      mockCommentRepository,
      mockThreadRepository,
    );

    // Action and Assert
    await expect(addReplyUseCase.execute(payload)).rejects.toThrowError(
      'ADD_REPLY_USE_CASE.THREAD_NOT_FOUND',
    );
  });

  it('should throw error when comment not found', async () => {
    // Arrange
    const payload: AddReplyUseCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      content: 'new reply',
      owner: 'user-123',
    };

    const mockReplyRepository = new ReplyRepository();

    const mockCommentRepository = new CommentRepository();

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.verifyThreadExists = vi.fn().mockResolvedValue(true);
    mockCommentRepository.verifyCommentAvailability = vi
      .fn()
      .mockResolvedValue(false);

    const addReplyUseCase = new AddReplyUseCase(
      mockReplyRepository,
      mockCommentRepository,
      mockThreadRepository,
    );

    // Action and Assert
    await expect(addReplyUseCase.execute(payload)).rejects.toThrowError(
      'ADD_REPLY_USE_CASE.COMMENT_NOT_FOUND',
    );
  });
});
