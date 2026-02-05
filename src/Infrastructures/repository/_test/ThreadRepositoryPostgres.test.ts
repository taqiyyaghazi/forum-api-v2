import { afterAll, afterEach, describe, expect, it } from 'vitest';
import AddedThread from '../../../Domains/threads/entities/AddedThread.js';
import NewThread from '../../../Domains/threads/entities/NewThread.js';
import ThreadsTableTestHelper from '../../../tests/ThreadsTableTestHelper.js';
import UsersTableTestHelper from '../../../tests/UsersTableTestHelper.js';
import pool from '../../database/postgres/pool.js';
import ThreadRepositoryPostgres from '../ThreadRepositoryPostgres.js';

describe.skip('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist new thread and return added thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-124',
        username: 'dicoding',
      });
      const idGenerator = (): string => '123';
      const threadRepository = new ThreadRepositoryPostgres(pool, idGenerator);
      const newThread = new NewThread({
        title: 'A Thread Title',
        body: 'Thread body content',
        owner: 'user-124',
      });

      // Action
      await threadRepository.addThread(newThread);

      // Assert
      const thread = await ThreadsTableTestHelper.findThreadById('thread-123');
      expect(thread).toHaveLength(1);
      expect(thread[0].title).toBe('A Thread Title');
      expect(thread[0].body).toBe('Thread body content');
      expect(thread[0].owner).toBe('user-124');
    });

    it('should return added thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-125',
        username: 'dicoding',
      });
      const idGenerator = (): string => '543';
      const threadRepository = new ThreadRepositoryPostgres(pool, idGenerator);
      const newThread = new NewThread({
        title: 'A Thread Title',
        body: 'Thread body content',
        owner: 'user-125',
      });

      // Action
      const addedThread = await threadRepository.addThread(newThread);

      // Assert
      expect(addedThread).toStrictEqual(
        new AddedThread({
          id: 'thread-543',
          title: 'A Thread Title',
          body: 'Thread body content',
          owner: 'user-125',
        }),
      );
    });
  });
});
