import { afterAll, afterEach, describe, expect, it } from 'vitest';
import pool from '../../database/postgres/pool.js';
import LikeRepositoryPostgres from '../LikeRepositoryPostgres.js';
import LikesTableTestHelper from '../../../../tests/LikesTableTestHelper.js';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper.js';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js';

describe('LikeRepositoryPostgres', () => {
  afterEach(async () => {
    await LikesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addLike', () => {
    it('should persist new like', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        owner: 'user-123',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
      });

      const likeRepositoryPostgres = new LikeRepositoryPostgres(
        pool,
        () => '123',
      );

      // Action
      await likeRepositoryPostgres.addLike('user-123', 'comment-123');

      // Assert
      const likes =
        await LikesTableTestHelper.findLikeByCommentId('comment-123');
      expect(likes).toBeDefined();
    });
  });

  describe('deleteLike', () => {
    it('should delete like from database', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        owner: 'user-123',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
      });
      await LikesTableTestHelper.addLike({
        id: 'like-123',
        owner: 'user-123',
        commentId: 'comment-123',
      });

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool);

      // Action
      await likeRepositoryPostgres.deleteLike('user-123', 'comment-123');

      // Assert
      const likes =
        await LikesTableTestHelper.findLikeByCommentId('comment-123');
      expect(likes).toBeUndefined();
    });
  });

  describe('checkLikeStatus', () => {
    it('should return true if like exists', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        owner: 'user-123',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
      });
      await LikesTableTestHelper.addLike({
        id: 'like-123',
        owner: 'user-123',
        commentId: 'comment-123',
      });

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool);

      // Action
      const isLiked = await likeRepositoryPostgres.checkLikeStatus(
        'user-123',
        'comment-123',
      );

      // Assert
      expect(isLiked).toEqual(true);
    });

    it('should return false if like does not exist', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        owner: 'user-123',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
      });

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool);

      // Action
      const isLiked = await likeRepositoryPostgres.checkLikeStatus(
        'user-123',
        'comment-123',
      );

      // Assert
      expect(isLiked).toEqual(false);
    });
  });
});
