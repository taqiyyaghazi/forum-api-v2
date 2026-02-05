export interface NewCommentPayload {
  content: string;
  threadId: string;
  owner: string;
}

class NewComment {
  readonly content: string;
  readonly threadId: string;
  readonly owner: string;

  constructor(payload: NewCommentPayload) {
    this._verifyPayload(payload);
    const { content, threadId, owner } = payload;
    this.content = content;
    this.threadId = threadId;
    this.owner = owner;
  }

  private _verifyPayload(payload: NewCommentPayload): void {
    if (!payload) {
      throw new Error('NEW_COMMENT.NOT_CONTAIN_PAYLOAD');
    }

    const { content, threadId, owner } = payload;

    if (!content || !threadId || !owner) {
      throw new Error('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof content !== 'string' ||
      typeof threadId !== 'string' ||
      typeof owner !== 'string'
    ) {
      throw new Error('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

export default NewComment;
