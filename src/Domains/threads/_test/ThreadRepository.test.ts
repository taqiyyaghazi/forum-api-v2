import { describe, expect, it } from 'vitest';
import ThreadRepository from '../ThreadRepository.js';
import NewThread from '../entities/NewThread.js';

describe('ThreadRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const threadRepository = new ThreadRepository();
    const newThread = {
      title: 'A Thread Title',
      body: 'Thread body content',
      owner: 'user-123',
    } as NewThread;

    // Action and Assert
    await expect(threadRepository.addThread(newThread)).rejects.toThrowError(
      'THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );
  });
});
