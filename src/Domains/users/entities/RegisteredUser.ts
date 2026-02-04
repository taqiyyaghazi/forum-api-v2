export interface RegisteredUserPayload {
  id: string;
  username: string;
  fullname: string;
}

class RegisteredUser {
  public readonly id: string;
  public readonly username: string;
  public readonly fullname: string;

  constructor(payload: RegisteredUserPayload) {
    this._verifyPayload(payload);

    this.id = payload.id;
    this.username = payload.username;
    this.fullname = payload.fullname;
  }

  private _verifyPayload(payload: RegisteredUserPayload): void {
    if (!payload) {
      throw new Error('REGISTERED_USER.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    const { id, username, fullname } = payload;

    if (!id || !username || !fullname) {
      throw new Error('REGISTERED_USER.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string' ||
      typeof username !== 'string' ||
      typeof fullname !== 'string'
    ) {
      throw new Error('REGISTERED_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

export default RegisteredUser;
