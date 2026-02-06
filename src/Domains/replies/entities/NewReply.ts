export interface NewReplyPayload {
  content: string;
}

class NewReply {
  content: string;

  constructor(payload: NewReplyPayload) {
    this._verifyPayload(payload);

    this.content = payload.content;
  }

  private _verifyPayload(payload: NewReplyPayload): void {
    if (!payload.content) {
      throw new Error('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof payload.content !== 'string') {
      throw new Error('NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

export default NewReply;
