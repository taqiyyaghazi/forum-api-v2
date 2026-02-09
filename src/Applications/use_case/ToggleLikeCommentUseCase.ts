import CommentRepository from '../../Domains/comments/CommentRepository.js';
import LikeRepository from '../../Domains/likes/LikeRepository.js';

export interface ToggleLikeCommentUseCasePayload {
  threadId: string;
  commentId: string;
  userId: string;
}

class ToggleLikeCommentUseCase {
  constructor(
    private readonly likeRepository: LikeRepository,
    private readonly commentRepository: CommentRepository,
  ) {}

  async execute(payload: ToggleLikeCommentUseCasePayload): Promise<void> {
    const { commentId, userId, threadId } = payload;

    const isCommentAvailable =
      await this.commentRepository.verifyCommentAvailability(
        commentId,
        threadId,
      );

    if (!isCommentAvailable) {
      throw new Error('TOGGLE_LIKE_COMMENT_USE_CASE.COMMENT_NOT_FOUND');
    }

    const isLiked = await this.likeRepository.checkLikeStatus(
      userId,
      commentId,
    );

    if (isLiked) {
      await this.likeRepository.deleteLike(userId, commentId);
    } else {
      await this.likeRepository.addLike(userId, commentId);
    }
  }
}

export default ToggleLikeCommentUseCase;
