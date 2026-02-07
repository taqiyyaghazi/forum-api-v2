import { afterAll, afterEach, describe, expect, it } from 'vitest';
import NewReply from '../../../Domains/replies/entities/NewReply';
import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper';
import RepliesTableTestHelper from '../../../../tests/RepliesTableTestHelper';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper';
import pool from '../../database/postgres/pool';
import ReplyRepositoryPostgres from '../ReplyRepositoryPostgres';

describe('ReplyRepositoryPostgres', () => {
  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  it('should add a reply correctly', async () => {
    // Arrange
    await UsersTableTestHelper.addUser({
      id: 'user-123',
      username: 'dicoding',
      password: 'password',
      fullname: 'Dicoding',
    });
    await ThreadsTableTestHelper.addThread({
      id: 'thread-123',
      title: 'thread',
      owner: 'user-123',
    });
    await CommentsTableTestHelper.addComment({
      id: 'comment-123',
      content: 'comment',
      owner: 'user-123',
      threadId: 'thread-123',
    });
    const commentId = 'comment-123';
    const owner = 'user-123';
    const fakeIdGenerator = (): string => '123';
    const replyRepository = new ReplyRepositoryPostgres(pool, fakeIdGenerator);
    const reply = new NewReply({
      content: 'reply',
    });

    // Action
    await replyRepository.addReply(reply, commentId, owner);

    // Assert
    const replies = await RepliesTableTestHelper.findReplyById('reply-123');
    expect(replies).toBeDefined();
    expect(replies?.content).toBe('reply');
    expect(replies?.owner).toBe('user-123');
    expect(replies?.comment_id).toBe('comment-123');
    expect(replies?.is_deleted).toBe(false);
  });

  it('should get replies by thread id correctly', async () => {
    // Arrange
    await UsersTableTestHelper.addUser({
      id: 'user-123',
      username: 'dicoding',
      password: 'password',
      fullname: 'Dicoding',
    });
    await ThreadsTableTestHelper.addThread({
      id: 'thread-123',
      title: 'thread',
      owner: 'user-123',
    });
    await ThreadsTableTestHelper.addThread({
      id: 'thread-456',
      title: 'thread',
      owner: 'user-123',
    });
    await CommentsTableTestHelper.addComment({
      id: 'comment-123',
      content: 'comment',
      owner: 'user-123',
      threadId: 'thread-123',
    });
    await CommentsTableTestHelper.addComment({
      id: 'comment-456',
      content: 'comment',
      owner: 'user-123',
      threadId: 'thread-456',
    });
    await RepliesTableTestHelper.addReply({
      id: 'reply-123',
      content: 'reply',
      owner: 'user-123',
      commentId: 'comment-123',
      date: new Date(),
      isDeleted: false,
    });
    await RepliesTableTestHelper.addReply({
      id: 'reply-456',
      content: 'reply',
      owner: 'user-123',
      commentId: 'comment-456',
      date: new Date(),
      isDeleted: false,
    });
    const threadId = 'thread-123';
    const fakeIdGenerator = (): string => '123';
    const replyRepository = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

    // Action
    const replies = await replyRepository.getRepliesByThreadId(threadId);

    // Assert
    expect(replies).toHaveLength(1);
    expect(replies[0].content).toBe('reply');
    expect(replies[0].date).toBeInstanceOf(Date);
    expect(replies[0].username).toBe('dicoding');
    expect(replies[0].isDeleted).toBe(false);
    expect(replies[0].id).toBe('reply-123');
    expect(replies[0].commentId).toBe('comment-123');
  });

  it('should check reply availability correctly', async () => {
    // Arrange
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const replyId = 'reply-123';
    await UsersTableTestHelper.addUser({
      id: 'user-123',
      username: 'dicoding',
      password: 'password',
      fullname: 'Dicoding',
    });
    await ThreadsTableTestHelper.addThread({
      id: threadId,
      title: 'thread',
      owner: 'user-123',
    });
    await CommentsTableTestHelper.addComment({
      id: commentId,
      content: 'comment',
      owner: 'user-123',
      threadId: threadId,
    });
    await RepliesTableTestHelper.addReply({
      id: replyId,
      content: 'reply',
      owner: 'user-123',
      commentId: commentId,
      date: new Date(),
      isDeleted: false,
    });
    const fakeIdGenerator = (): string => '123';
    const replyRepository = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

    // Action
    const isAvailable = await replyRepository.checkReplyAvailability(
      replyId,
      commentId,
      threadId,
    );

    // Assert
    expect(isAvailable).toBe(true);
  });

  it('should verify reply owner correctly', async () => {
    // Arrange
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const replyId = 'reply-123';
    const owner = 'user-123';
    await UsersTableTestHelper.addUser({
      id: 'user-123',
      username: 'dicoding',
      password: 'password',
      fullname: 'Dicoding',
    });
    await ThreadsTableTestHelper.addThread({
      id: threadId,
      title: 'thread',
      owner: owner,
    });
    await CommentsTableTestHelper.addComment({
      id: commentId,
      content: 'comment',
      owner: owner,
      threadId: threadId,
    });
    await RepliesTableTestHelper.addReply({
      id: replyId,
      content: 'reply',
      owner: owner,
      commentId: commentId,
      date: new Date(),
      isDeleted: false,
    });
    const fakeIdGenerator = (): string => '123';
    const replyRepository = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

    // Action
    const isOwner = await replyRepository.verifyReplyOwner(replyId, owner);

    // Assert
    expect(isOwner).toBe(true);
  });

  it('should delete reply correctly', async () => {
    // Arrange
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const replyId = 'reply-123';
    const owner = 'user-123';
    await UsersTableTestHelper.addUser({
      id: 'user-123',
      username: 'dicoding',
      password: 'password',
      fullname: 'Dicoding',
    });
    await ThreadsTableTestHelper.addThread({
      id: threadId,
      title: 'thread',
      owner: owner,
    });
    await CommentsTableTestHelper.addComment({
      id: commentId,
      content: 'comment',
      owner: owner,
      threadId: threadId,
    });
    await RepliesTableTestHelper.addReply({
      id: replyId,
      content: 'reply',
      owner: owner,
      commentId: commentId,
      date: new Date(),
      isDeleted: false,
    });
    const fakeIdGenerator = (): string => '123';
    const replyRepository = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

    // Action
    await replyRepository.deleteReply(replyId);

    // Assert
    const replies = await RepliesTableTestHelper.findReplyById(replyId);
    expect(replies).toBeDefined();
    expect(replies?.is_deleted).toBe(true);
  });
});
