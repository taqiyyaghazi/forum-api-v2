export interface CommentDetailPayload {
  id: string;
  username: string;
  date: Date;
  content: string;
  isDeleted: boolean;
}

class CommentDetail {
  readonly id: string;
  readonly username: string;
  readonly date: Date;
  readonly content: string;

  constructor(payload: CommentDetailPayload) {
    this._verifyPayload(payload);
    const { id, username, date, content, isDeleted } = payload;
    this.id = id;
    this.username = username;
    this.date = date;
    this.content = isDeleted ? '**komentar telah dihapus**' : content;
  }

  private _verifyPayload(payload: CommentDetailPayload): void {
    if (!payload) {
      throw new Error('COMMENT_DETAIL.NOT_CONTAIN_PAYLOAD');
    }

    const { id, username, date, content } = payload;

    if (!id || !username || !date || !content) {
      throw new Error('COMMENT_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string' ||
      typeof username !== 'string' ||
      !(date instanceof Date) ||
      typeof content !== 'string'
    ) {
      throw new Error('COMMENT_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

export default CommentDetail;
