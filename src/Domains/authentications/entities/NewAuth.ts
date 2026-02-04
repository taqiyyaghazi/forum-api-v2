export interface NewAuthPayload {
  accessToken: string;
  refreshToken: string;
}

class NewAuth {
  public readonly accessToken: string;
  public readonly refreshToken: string;

  constructor(payload: NewAuthPayload) {
    this._verifyPayload(payload);

    this.accessToken = payload.accessToken;
    this.refreshToken = payload.refreshToken;
  }

  private _verifyPayload(payload: NewAuthPayload): void {
    if (!payload) {
      throw new Error('NEW_AUTH.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    const { accessToken, refreshToken } = payload;

    if (!accessToken || !refreshToken) {
      throw new Error('NEW_AUTH.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof accessToken !== 'string' || typeof refreshToken !== 'string') {
      throw new Error('NEW_AUTH.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

export default NewAuth;
