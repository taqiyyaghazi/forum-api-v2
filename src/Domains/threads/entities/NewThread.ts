interface NewThreadPayload {
  title: string;
  body: string;
  owner: string;
}

class NewThread {
  public readonly title: string;
  public readonly body: string;
  public readonly owner: string;
  constructor(payload: NewThreadPayload) {
    this._verifyPayload(payload);

    const { title, body, owner } = payload;

    this.title = title;
    this.body = body;
    this.owner = owner;
  }

  private _verifyPayload(payload: NewThreadPayload): void {
    if (!payload) {
      throw new Error('NEW_THREAD.NOT_CONTAIN_PAYLOAD');
    }

    const { title, body, owner } = payload;

    if (!title || !body || !owner) {
      throw new Error('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof title !== 'string' ||
      typeof body !== 'string' ||
      typeof owner !== 'string'
    ) {
      throw new Error('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

export default NewThread;
