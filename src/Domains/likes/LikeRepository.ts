/* eslint-disable @typescript-eslint/no-unused-vars */
class LikeRepository {
  async addLike(_userId: string, _commentId: string): Promise<void> {
    throw new Error('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async deleteLike(_userId: string, _commentId: string): Promise<void> {
    throw new Error('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async checkLikeStatus(_userId: string, _commentId: string): Promise<boolean> {
    throw new Error('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

export default LikeRepository;
