export interface DeleteCommentPayload {
  threadId: string;
  commentId: string;
  owner: string;
}

class DeleteComment {
  readonly threadId: string;
  readonly commentId: string;
  readonly owner: string;

  constructor(payload: DeleteCommentPayload) {
    this._verifyPayload(payload);
    const { threadId, commentId, owner } = payload;

    this.threadId = threadId;
    this.commentId = commentId;
    this.owner = owner;
  }

  private _verifyPayload(payload: DeleteCommentPayload): void {
    if (!payload) {
      throw new Error('DELETE_COMMENT.NOT_CONTAIN_PAYLOAD');
    }

    const { threadId, commentId, owner } = payload;

    if (!threadId || !commentId || !owner) {
      throw new Error('DELETE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof threadId !== 'string' ||
      typeof commentId !== 'string' ||
      typeof owner !== 'string'
    ) {
      throw new Error('DELETE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

export default DeleteComment;
