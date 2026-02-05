import CommentRepository from '../../Domains/comments/CommentRepository.js';
import CommentDetail from '../../Domains/comments/entities/CommentDetail.js';
import ThreadRepository from '../../Domains/threads/ThreadRepository.js';
import ThreadDetail from '../../Domains/threads/entities/ThreadDetail.js';

class GetThreadDetailUseCase {
  constructor(
    private readonly threadRepository: ThreadRepository,
    private readonly commentRepository: CommentRepository,
  ) {}

  async execute(threadId: string): Promise<ThreadDetail> {
    const thread = await this.threadRepository.getThreadById(threadId);

    if (!thread) {
      throw new Error('GET_THREAD_DETAIL_USE_CASE.THREAD_NOT_FOUND');
    }

    const rawComments =
      await this.commentRepository.getCommentsByThreadId(threadId);

    const comments = rawComments.map(
      (comment) =>
        new CommentDetail({
          id: comment.id,
          username: comment.username,
          date: comment.date,
          content: comment.content,
          isDeleted: comment.isDeleted,
        }),
    );

    return new ThreadDetail({
      id: thread.id,
      title: thread.title,
      body: thread.body,
      date: thread.date,
      username: thread.username,
      comments,
    });
  }
}

export default GetThreadDetailUseCase;
