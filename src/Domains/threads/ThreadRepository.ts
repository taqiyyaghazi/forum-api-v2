/* eslint-disable @typescript-eslint/no-unused-vars */

import AddedThread from './entities/AddedThread.js';
import NewThread from './entities/NewThread.js';

class ThreadRepository {
  async addThread(_payload: NewThread): Promise<AddedThread> {
    throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

export default ThreadRepository;
