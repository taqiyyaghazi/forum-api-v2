export interface AddedCommentPayload {
  id: string;
  content: string;
  owner: string;
}

class AddedComment {
  readonly id: string;
  readonly content: string;
  readonly owner: string;

  constructor(payload: AddedCommentPayload) {
    this._verifyPayload(payload);
    const { id, content, owner } = payload;
    this.id = id;
    this.content = content;
    this.owner = owner;
  }

  private _verifyPayload(payload: AddedCommentPayload): void {
    if (!payload) {
      throw new Error('ADDED_COMMENT.NOT_CONTAIN_PAYLOAD');
    }

    const { id, content, owner } = payload;

    if (!id || !content || !owner) {
      throw new Error('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string' ||
      typeof content !== 'string' ||
      typeof owner !== 'string'
    ) {
      throw new Error('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

export default AddedComment;
