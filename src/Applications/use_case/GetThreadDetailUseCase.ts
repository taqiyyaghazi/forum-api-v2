import CommentRepository from '../../Domains/comments/CommentRepository.js';
import CommentDetail from '../../Domains/comments/entities/CommentDetail.js';
import ReplyRepository from '../../Domains/replies/ReplyRepository.js';
import ReplyDetail from '../../Domains/replies/entities/ReplyDetail.js';
import ThreadRepository from '../../Domains/threads/ThreadRepository.js';
import ThreadDetail from '../../Domains/threads/entities/ThreadDetail.js';

class GetThreadDetailUseCase {
  constructor(
    private readonly threadRepository: ThreadRepository,
    private readonly commentRepository: CommentRepository,
    private readonly replyRepository: ReplyRepository,
  ) {}

  async execute(threadId: string): Promise<ThreadDetail> {
    const thread = await this.threadRepository.getThreadById(threadId);

    if (!thread) {
      throw new Error('GET_THREAD_DETAIL_USE_CASE.THREAD_NOT_FOUND');
    }

    const [rawComments, rawReplies] = await Promise.all([
      this.commentRepository.getCommentsByThreadId(threadId),
      this.replyRepository.getRepliesByThreadId(threadId),
    ]);

    const comments = rawComments.map(
      (comment) =>
        new CommentDetail({
          id: comment.id,
          username: comment.username,
          date: comment.date,
          content: comment.content,
          isDeleted: comment.isDeleted,
          likeCount: comment.likeCount,
          replies: rawReplies
            .filter((reply) => reply.commentId === comment.id)
            .map((reply) => new ReplyDetail(reply)),
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
