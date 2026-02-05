import { describe, expect, it, vi } from 'vitest';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import AddThreadUseCase from '../AddThreadUseCase.js';

describe('AddThreadUseCase', () => {
  it('should orchestrate the add thread action correctly', async () => {
    // Arrange
    const payload = {
      title: 'A Thread Title',
      body: 'Thread body content',
      owner: 'user-123',
    };

    const expectedAddedThread = {
      id: 'thread-123',
      title: payload.title,
      body: payload.body,
      owner: payload.owner,
    };

    const mockThreadRepository = {
      addThread: vi.fn().mockResolvedValue(expectedAddedThread),
    } as unknown as ThreadRepository;

    const addThreadUseCase = new AddThreadUseCase(mockThreadRepository);

    // Action
    const result = await addThreadUseCase.execute(payload);

    // Assert
    expect(result).toEqual(expectedAddedThread);
    expect(mockThreadRepository.addThread).toBeCalledWith(
      expect.objectContaining({
        title: payload.title,
        body: payload.body,
        owner: payload.owner,
      }),
    );
  });
});
