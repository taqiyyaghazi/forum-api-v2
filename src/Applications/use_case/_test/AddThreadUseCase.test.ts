import { describe, expect, it, vi } from 'vitest';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import AddThreadUseCase from '../AddThreadUseCase.js';
import NewThread from '../../../Domains/threads/entities/NewThread.js';

describe('AddThreadUseCase', () => {
  it('should orchestrate the add thread action correctly', async () => {
    // Arrange
    const payload = {
      title: 'A Thread Title',
      body: 'Thread body content',
      owner: 'user-123',
    };

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.addThread = vi.fn().mockResolvedValue({
      id: 'thread-123',
      title: 'A Thread Title',
      body: 'Thread body content',
      owner: 'user-123',
    });

    const addThreadUseCase = new AddThreadUseCase(mockThreadRepository);

    // Action
    const result = await addThreadUseCase.execute(payload);

    // Assert
    expect(result).toEqual({
      id: 'thread-123',
      title: 'A Thread Title',
      body: 'Thread body content',
      owner: 'user-123',
    });
    expect(mockThreadRepository.addThread).toBeCalledWith(
      new NewThread({
        title: 'A Thread Title',
        body: 'Thread body content',
        owner: 'user-123',
      }),
    );
  });
});
