import CommentDetail from '../../comments/entities/CommentDetail.js';

export interface ThreadDetailPayload {
  id: string;
  title: string;
  body: string;
  date: Date;
  username: string;
  comments: CommentDetail[];
}

class ThreadDetail {
  readonly id: string;
  readonly title: string;
  readonly body: string;
  readonly date: Date;
  readonly username: string;
  readonly comments: CommentDetail[];

  constructor(payload: ThreadDetailPayload) {
    this._verifyPayload(payload);
    const { id, title, body, date, username, comments } = payload;
    this.id = id;
    this.title = title;
    this.body = body;
    this.date = date;
    this.username = username;
    this.comments = comments;
  }

  private _verifyPayload(payload: ThreadDetailPayload): void {
    if (!payload) {
      throw new Error('THREAD_DETAIL.NOT_CONTAIN_PAYLOAD');
    }

    const { id, title, body, date, username, comments } = payload;

    if (!id || !title || !body || !date || !username || !comments) {
      throw new Error('THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string' ||
      typeof title !== 'string' ||
      typeof body !== 'string' ||
      !(date instanceof Date) ||
      typeof username !== 'string' ||
      !Array.isArray(comments)
    ) {
      throw new Error('THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

export default ThreadDetail;
