import ReplyDetail from '../../replies/entities/ReplyDetail.js';

export interface CommentDetailPayload {
  id: string;
  username: string;
  date: Date;
  content: string;
  isDeleted: boolean;
  likeCount: number;
  replies: ReplyDetail[];
}

class CommentDetail {
  readonly id: string;
  readonly username: string;
  readonly date: Date;
  readonly content: string;
  readonly likeCount: number;
  readonly replies: ReplyDetail[];

  constructor(payload: CommentDetailPayload) {
    this._verifyPayload(payload);
    const { id, username, date, content, isDeleted, likeCount, replies } =
      payload;
    this.id = id;
    this.username = username;
    this.date = date;
    this.content = isDeleted ? '**komentar telah dihapus**' : content;
    this.likeCount = likeCount;
    this.replies = replies;
  }

  private _verifyPayload(payload: CommentDetailPayload): void {
    if (!payload) {
      throw new Error('COMMENT_DETAIL.NOT_CONTAIN_PAYLOAD');
    }

    const { id, username, date, content, likeCount, replies } = payload;

    if (
      !id ||
      !username ||
      !date ||
      !content ||
      typeof likeCount === 'undefined' ||
      likeCount === null ||
      !replies
    ) {
      throw new Error('COMMENT_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string' ||
      typeof username !== 'string' ||
      !(date instanceof Date) ||
      typeof content !== 'string' ||
      typeof likeCount !== 'number' ||
      !Array.isArray(replies)
    ) {
      throw new Error('COMMENT_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

export default CommentDetail;
