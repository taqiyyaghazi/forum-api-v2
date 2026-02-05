/* eslint-disable @typescript-eslint/no-unused-vars */

import AddedThread from './entities/AddedThread.js';
import NewThread from './entities/NewThread.js';

class ThreadRepository {
  async addThread(_payload: NewThread): Promise<AddedThread> {
    throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyThreadExists(_threadId: string): Promise<boolean> {
    throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getThreadById(_threadId: string): Promise<{
    id: string;
    title: string;
    body: string;
    date: Date;
    username: string;
  } | null> {
    throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

export default ThreadRepository;
