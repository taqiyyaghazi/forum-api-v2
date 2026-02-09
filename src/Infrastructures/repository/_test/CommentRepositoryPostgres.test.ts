import { afterAll, afterEach, describe, expect, it } from 'vitest';
import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper.js';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import LikesTableTestHelper from '../../../../tests/LikesTableTestHelper.js';
import NewComment from '../../../Domains/comments/entities/NewComment.js';
import AddedComment from '../../../Domains/comments/entities/AddedComment.js';
import pool from '../../database/postgres/pool.js';
import CommentRepositoryPostgres from '../CommentRepositoryPostgres.js';

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await LikesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  it('should add a comment correctly', async () => {
    // Arrange
    await UsersTableTestHelper.addUser({
      id: 'user-comment-123',
      username: 'dicoding-comment',
    });
    await ThreadsTableTestHelper.addThread({
      id: 'thread-comment-123',
      owner: 'user-comment-123',
    });
    const newComment = new NewComment({
      content: 'sebuah comment',
      threadId: 'thread-comment-123',
      owner: 'user-comment-123',
    });
    const fakeIdGenerator = (): string => '123';
    const commentRepositoryPostgres = new CommentRepositoryPostgres(
      pool,
      fakeIdGenerator,
    );

    // Action
    const addedComment = await commentRepositoryPostgres.addComment(newComment);

    // Assert
    expect(addedComment).toStrictEqual(
      new AddedComment({
        id: 'comment-123',
        content: 'sebuah comment',
        owner: 'user-comment-123',
      }),
    );

    const comment =
      await CommentsTableTestHelper.findCommentById('comment-123');
    expect(comment).toBeDefined();
    expect(comment?.content).toBe('sebuah comment');
  });

  it('should get comments by thread id correctly', async () => {
    // Arrange
    await UsersTableTestHelper.addUser({
      id: 'user-comment-123',
      username: 'dicoding-comment',
    });
    await UsersTableTestHelper.addUser({
      id: 'user-comment-456',
      username: 'johndoe-comment',
    });

    await ThreadsTableTestHelper.addThread({
      id: 'thread-comment-123',
      owner: 'user-comment-123',
    });

    const date1 = new Date('2021-08-08T07:22:33.555Z');
    const date2 = new Date('2021-08-08T07:26:21.338Z');

    await CommentsTableTestHelper.addComment({
      id: 'comment-123',
      content: 'sebuah comment',
      owner: 'user-comment-456',
      threadId: 'thread-comment-123',
      date: date1,
      isDeleted: false,
    });

    await CommentsTableTestHelper.addComment({
      id: 'comment-456',
      content: 'sebuah comment lainnya',
      owner: 'user-comment-123',
      threadId: 'thread-comment-123',
      date: date2,
      isDeleted: true,
    });

    await LikesTableTestHelper.addLike({
      id: 'like-123',
      owner: 'user-comment-123',
      commentId: 'comment-123',
    });

    const fakeIdGenerator = (): string => '123';
    const commentRepositoryPostgres = new CommentRepositoryPostgres(
      pool,
      fakeIdGenerator,
    );

    // Action
    const comments =
      await commentRepositoryPostgres.getCommentsByThreadId(
        'thread-comment-123',
      );

    // Assert
    expect(comments).toHaveLength(2);
    expect(comments[0]).toStrictEqual({
      id: 'comment-123',
      username: 'johndoe-comment',
      date: date1,
      content: 'sebuah comment',

      isDeleted: false,
      likeCount: 1,
    });
    expect(comments[1]).toStrictEqual({
      id: 'comment-456',
      username: 'dicoding-comment',
      date: date2,
      content: 'sebuah comment lainnya',
      isDeleted: true,
      likeCount: 0,
    });
  });

  it('should return empty array when comments are not exist', async () => {
    // Arrange
    const fakeIdGenerator = (): string => '123';
    const commentRepositoryPostgres = new CommentRepositoryPostgres(
      pool,
      fakeIdGenerator,
    );

    // Action
    const comments =
      await commentRepositoryPostgres.getCommentsByThreadId(
        'thread-comment-123',
      );

    // Assert
    expect(comments).toHaveLength(0);
  });

  it('should verify comment availability correctly', async () => {
    // Arrange
    await UsersTableTestHelper.addUser({
      id: 'user-comment-123',
      username: 'dicoding-comment',
    });
    await ThreadsTableTestHelper.addThread({
      id: 'thread-comment-123',
      owner: 'user-comment-123',
    });
    await CommentsTableTestHelper.addComment({
      id: 'comment-123',
      content: 'sebuah comment',
      owner: 'user-comment-123',
      threadId: 'thread-comment-123',
    });
    const fakeIdGenerator = (): string => '123';
    const commentRepositoryPostgres = new CommentRepositoryPostgres(
      pool,
      fakeIdGenerator,
    );

    // Action
    const isExist =
      await commentRepositoryPostgres.verifyCommentAvailability('comment-123', 'thread-comment-123');

    // Assert
    expect(isExist).toBe(true);
  });

  it('should return false when comment is not available', async () => {
    // Arrange
    const fakeIdGenerator = (): string => '123';
    const commentRepositoryPostgres = new CommentRepositoryPostgres(
      pool,
      fakeIdGenerator,
    );

    // Action
    const isExist =
      await commentRepositoryPostgres.verifyCommentAvailability('comment-123', 'thread-comment-123');

    // Assert
    expect(isExist).toBe(false);
  });

  it('should verify comment owner correctly', async () => {
    // Arrange
    await UsersTableTestHelper.addUser({
      id: 'user-comment-123',
      username: 'dicoding-comment',
    });
    await ThreadsTableTestHelper.addThread({
      id: 'thread-comment-123',
      owner: 'user-comment-123',
    });
    await CommentsTableTestHelper.addComment({
      id: 'comment-123',
      content: 'sebuah comment',
      owner: 'user-comment-123',
      threadId: 'thread-comment-123',
    });
    const fakeIdGenerator = (): string => '123';
    const commentRepositoryPostgres = new CommentRepositoryPostgres(
      pool,
      fakeIdGenerator,
    );

    // Action
    const isOwner = await commentRepositoryPostgres.verifyCommentOwner(
      'comment-123',
      'user-comment-123',
    );

    // Assert
    expect(isOwner).toBe(true);
  });

  it('should return false when comment owner is not verified', async () => {
    // Arrange
    await UsersTableTestHelper.addUser({
      id: 'user-comment-123',
      username: 'dicoding-comment',
    });
    await ThreadsTableTestHelper.addThread({
      id: 'thread-comment-123',
      owner: 'user-comment-123',
    });
    await CommentsTableTestHelper.addComment({
      id: 'comment-123',
      content: 'sebuah comment',
      owner: 'user-comment-123',
      threadId: 'thread-comment-123',
    });
    const fakeIdGenerator = (): string => '123';
    const commentRepositoryPostgres = new CommentRepositoryPostgres(
      pool,
      fakeIdGenerator,
    );

    // Action
    const isOwner = await commentRepositoryPostgres.verifyCommentOwner(
      'comment-123',
      'user-comment-456',
    );

    // Assert
    expect(isOwner).toBe(false);
  });

  it('should delete comment correctly', async () => {
    // Arrange
    await UsersTableTestHelper.addUser({
      id: 'user-comment-123',
      username: 'dicoding-comment',
    });
    await ThreadsTableTestHelper.addThread({
      id: 'thread-comment-123',
      owner: 'user-comment-123',
    });
    await CommentsTableTestHelper.addComment({
      id: 'comment-123',
      content: 'sebuah comment',
      owner: 'user-comment-123',
      threadId: 'thread-comment-123',
    });
    const fakeIdGenerator = (): string => '123';
    const commentRepositoryPostgres = new CommentRepositoryPostgres(
      pool,
      fakeIdGenerator,
    );

    // Action
    await commentRepositoryPostgres.deleteComment('comment-123');

    // Assert
    const comment =
      await CommentsTableTestHelper.findCommentById('comment-123');
    expect(comment).toBeDefined();
    expect(comment?.is_deleted).toBe(true);
  });
});
