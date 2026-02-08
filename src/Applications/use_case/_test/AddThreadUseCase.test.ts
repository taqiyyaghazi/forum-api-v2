import { describe, expect, it, vi } from 'vitest';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import AddThreadUseCase, { AddThreadUseCasePayload } from '../AddThreadUseCase.js';
import NewThread from '../../../Domains/threads/entities/NewThread.js';
import AddedThread from '../../../Domains/threads/entities/AddedThread.js';

describe('AddThreadUseCase', () => {
  it('should orchestrate the add thread action correctly', async () => {
    // Arrange
    const payload: AddThreadUseCasePayload = {
      title: 'A Thread Title',
      body: 'Thread body content',
      owner: 'user-123',
    };

    const mockAddedThread = new AddedThread({
      id: 'thread-123',
      title: 'A Thread Title',
      body: 'Thread body content',
      owner: 'user-123',
    });

    const expectedAddedThread = new AddedThread({
      id: 'thread-123',
      title: 'A Thread Title',
      body: 'Thread body content',
      owner: 'user-123',
    });

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.addThread = vi.fn().mockResolvedValue(mockAddedThread);

    const addThreadUseCase = new AddThreadUseCase(mockThreadRepository);

    // Action
    const result = await addThreadUseCase.execute(payload);

    // Assert
    expect(result).toBeInstanceOf(AddedThread);
    expect(result).toStrictEqual(expectedAddedThread);
    expect(mockThreadRepository.addThread).toBeCalledWith(
      new NewThread({
        title: 'A Thread Title',
        body: 'Thread body content',
        owner: 'user-123',
      }),
    );
  });
});
