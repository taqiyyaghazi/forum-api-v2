interface DeleteReplyPayload {
  threadId: string;
  commentId: string;
  replyId: string;
  owner: string;
}

class DeleteReply {
  readonly threadId: string;
  readonly commentId: string;
  readonly replyId: string;
  readonly owner: string;

  constructor(payload: DeleteReplyPayload) {
    this._verifyPayload(payload);

    const { threadId, commentId, replyId, owner } = payload;

    this.threadId = threadId;
    this.commentId = commentId;
    this.replyId = replyId;
    this.owner = owner;
  }

  private _verifyPayload(payload: DeleteReplyPayload): void {
    const { threadId, commentId, replyId, owner } = payload;

    if (!threadId || !commentId || !replyId || !owner) {
      throw new Error('DELETE_REPLY_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof threadId !== 'string' ||
      typeof commentId !== 'string' ||
      typeof replyId !== 'string' ||
      typeof owner !== 'string'
    ) {
      throw new Error('DELETE_REPLY_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

export default DeleteReply;
