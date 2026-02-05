interface AddedThreadPayload {
  id: string;
  title: string;
  body: string;
  owner: string;
}

class AddedThread {
  public readonly id: string;
  public readonly title: string;
  public readonly body: string;
  public readonly owner: string;
  constructor(payload: AddedThreadPayload) {
    this._verifyPayload(payload);

    this.id = payload.id;
    this.title = payload.title;
    this.body = payload.body;
    this.owner = payload.owner;
  }

  private _verifyPayload(payload: AddedThreadPayload): void {
    if (!payload) {
      throw new Error('ADDED_THREAD.NOT_CONTAIN_PAYLOAD');
    }

    if (!payload.id || !payload.title || !payload.body || !payload.owner) {
      throw new Error('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof payload.id !== 'string' ||
      typeof payload.title !== 'string' ||
      typeof payload.body !== 'string' ||
      typeof payload.owner !== 'string'
    ) {
      throw new Error('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

export default AddedThread;
