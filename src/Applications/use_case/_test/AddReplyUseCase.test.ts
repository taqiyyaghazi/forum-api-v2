import { describe, expect, it, vi } from 'vitest';
import AddReplyUseCase from '../AddReplyUseCase.js';
import ReplyRepository from '../../../Domains/replies/ReplyRepository.js';
import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import NewReply from '../../../Domains/replies/entities/NewReply.js';
import AddedReply from '../../../Domains/replies/entities/AddedReply.js';

describe('AddReplyUseCase', () => {
  it('should create added reply correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      content: 'new reply',
      owner: 'user-123',
    };

    const mockReplyRepository = new ReplyRepository();

    const mockCommentRepository = new CommentRepository();

    const mockThreadRepository = new ThreadRepository();

    const expectedAddedReply = new AddedReply({
      id: 'reply-123',
      content: 'new reply',
      owner: 'user-123',
    });

    mockReplyRepository.addReply = vi.fn().mockResolvedValue(
      new AddedReply({
        id: 'reply-123',
        content: 'new reply',
        owner: 'user-123',
      }),
    );
    mockCommentRepository.isCommentExist = vi.fn().mockResolvedValue(true);
    mockThreadRepository.verifyThreadExists = vi.fn().mockResolvedValue(true);

    const addReplyUseCase = new AddReplyUseCase(
      mockReplyRepository,
      mockCommentRepository,
      mockThreadRepository,
    );

    // Action
    const addedReply = await addReplyUseCase.execute(useCasePayload);

    // Assert
    expect(addedReply).toBeInstanceOf(AddedReply);
    expect(addedReply).toEqual(expectedAddedReply);
    expect(mockThreadRepository.verifyThreadExists).toHaveBeenCalledWith(
      'thread-123',
    );
    expect(mockCommentRepository.isCommentExist).toHaveBeenCalledWith(
      'comment-123',
    );
    expect(mockReplyRepository.addReply).toHaveBeenCalledWith(
      new NewReply({ content: 'new reply' }),
      'comment-123',
      'user-123',
    );
  });

  it('should throw error when thread not found', async () => {
    // Arrange
    const useCasePayload = {
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
    await expect(addReplyUseCase.execute(useCasePayload)).rejects.toThrowError(
      'ADD_REPLY_USE_CASE.THREAD_NOT_FOUND',
    );
  });

  it('should throw error when comment not found', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      content: 'new reply',
      owner: 'user-123',
    };

    const mockReplyRepository = new ReplyRepository();

    const mockCommentRepository = new CommentRepository();

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.verifyThreadExists = vi.fn().mockResolvedValue(true);
    mockCommentRepository.isCommentExist = vi.fn().mockResolvedValue(false);

    const addReplyUseCase = new AddReplyUseCase(
      mockReplyRepository,
      mockCommentRepository,
      mockThreadRepository,
    );

    // Action and Assert
    await expect(addReplyUseCase.execute(useCasePayload)).rejects.toThrowError(
      'ADD_REPLY_USE_CASE.COMMENT_NOT_FOUND',
    );
  });
});
