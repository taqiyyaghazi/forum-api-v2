export interface ReplyDetailPayload {
  id: string;
  content: string;
  date: Date;
  username: string;
  isDeleted?: boolean;
}

class ReplyDetail {
  id: string;
  content: string;
  date: Date;
  username: string;

  constructor(payload: ReplyDetailPayload) {
    this._verifyPayload(payload);
    const { id, content, date, username, isDeleted } = payload;

    this.id = id;
    this.content = isDeleted ? '**balasan telah dihapus**' : content;
    this.date = date;
    this.username = username;
  }

  private _verifyPayload(payload: ReplyDetailPayload): void {
    const { id, content, date, username, isDeleted } = payload;

    if (!id || !content || !date || !username) {
      throw new Error('REPLY_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string' ||
      typeof content !== 'string' ||
      !(date instanceof Date) ||
      typeof username !== 'string' ||
      typeof isDeleted !== 'boolean'
    ) {
      throw new Error('REPLY_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

export default ReplyDetail;
