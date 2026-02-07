import { afterAll, afterEach, describe, expect, it } from 'vitest';
import NewThread from '../../../Domains/threads/entities/NewThread.js';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import pool from '../../database/postgres/pool.js';
import ThreadRepositoryPostgres from '../ThreadRepositoryPostgres.js';

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  it('should add thread correctly', async () => {
    // Arrange
    await UsersTableTestHelper.addUser({
      id: 'user-thread-124',
      username: 'dicoding-thread',
    });
    const idGenerator = (): string => '123';
    const threadRepository = new ThreadRepositoryPostgres(pool, idGenerator);
    const newThread = new NewThread({
      title: 'A Thread Title',
      body: 'Thread body content',
      owner: 'user-thread-124',
    });

    // Action
    await threadRepository.addThread(newThread);

    // Assert
    const thread = await ThreadsTableTestHelper.findThreadById('thread-123');
    expect(thread).toBeDefined();
    expect(thread?.title).toBe('A Thread Title');
    expect(thread?.body).toBe('Thread body content');
    expect(thread?.owner).toBe('user-thread-124');
  });

  it('should verify thread exists correctly', async () => {
    // Arrange
    const idGenerator = (): string => '123';
    await UsersTableTestHelper.addUser({
      id: 'user-thread-123',
      username: 'dicoding-thread-3',
    });
    await ThreadsTableTestHelper.addThread({
      id: 'thread-thread-123',
      owner: 'user-thread-123',
    });
    const repository = new ThreadRepositoryPostgres(pool, idGenerator);

    // Action & Assert
    await expect(
      repository.verifyThreadExists('thread-thread-123'),
    ).resolves.toBe(true);
  });

  it('should return null if thread not exists', async () => {
    // Arrange
    const idGenerator = (): string => '123';
    const repository = new ThreadRepositoryPostgres(pool, idGenerator);

    // Action & Assert
    const thread = await repository.getThreadById('thread-456');
    expect(thread).toBeNull();
  });

  it('should return thread details correctly', async () => {
    // Arrange
    await UsersTableTestHelper.addUser({
      id: 'user-thread-get-123',
      username: 'dicoding-thread-4',
    });
    const date = new Date();
    await ThreadsTableTestHelper.addThread({
      id: 'thread-get-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      owner: 'user-thread-get-123',
      date: date,
    });
    const idGenerator = (): string => '123';
    const repository = new ThreadRepositoryPostgres(pool, idGenerator);

    // Action
    const thread = await repository.getThreadById('thread-get-123');

    // Assert
    expect(thread).toStrictEqual({
      id: 'thread-get-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: date,
      username: 'dicoding-thread-4',
    });
  });
});
