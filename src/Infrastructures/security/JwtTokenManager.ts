import jwt from 'jsonwebtoken';
import TokenManager, {
  TokenPayload,
} from '../../Applications/security/TokenManager.js';
import config from '../../Commons/config.js';

class JwtTokenManager extends TokenManager {
  constructor(private readonly _jwt: typeof jwt) {
    super();
  }

  async createAccessToken(payload: TokenPayload): Promise<string> {
    return this._jwt.sign(payload, config.auth.accessTokenKey as string);
  }

  async createRefreshToken(payload: TokenPayload): Promise<string> {
    return this._jwt.sign(payload, config.auth.refreshTokenKey as string);
  }

  async verifyRefreshToken(token: string): Promise<boolean> {
    try {
      this._jwt.verify(token, config.auth.refreshTokenKey as string);
      return true;
    } catch {
      return false;
    }
  }

  async decodePayload(token: string): Promise<TokenPayload> {
    const decoded = this._jwt.decode(token) as TokenPayload;
    return decoded;
  }
}

export default JwtTokenManager;
