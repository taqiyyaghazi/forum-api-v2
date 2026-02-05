import NewThread from '../../Domains/threads/entities/NewThread.js';
import ThreadRepository from '../../Domains/threads/ThreadRepository.js';

interface AddThreadUseCasePayload {
  title: string;
  body: string;
  owner: string;
}

interface AddThreadUseCaseResult {
  id: string;
  title: string;
  body: string;
  owner: string;
}

class AddThreadUseCase {
  constructor(private readonly threadRepository: ThreadRepository) {}

  async execute(
    payload: AddThreadUseCasePayload,
  ): Promise<AddThreadUseCaseResult> {
    const newThread = new NewThread(payload);
    return this.threadRepository.addThread(newThread);
  }
}

export default AddThreadUseCase;
