export interface RefreshTokenPayload {
  refreshToken: string;
}

class RefreshToken {
  public readonly refreshToken: string;

  constructor(payload: RefreshTokenPayload) {
    this._verifyPayload(payload);
    this.refreshToken = payload.refreshToken;
  }

  private _verifyPayload(payload: RefreshTokenPayload): void {
    if (!payload) {
      throw new Error('REFRESH_TOKEN.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    const { refreshToken } = payload;

    if (!refreshToken) {
      throw new Error('REFRESH_TOKEN.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof refreshToken !== 'string') {
      throw new Error('REFRESH_TOKEN.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

export default RefreshToken;
