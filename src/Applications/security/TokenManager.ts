/* eslint-disable @typescript-eslint/no-unused-vars */
export interface TokenPayload {
  id: string;
}

class TokenManager {
  async createRefreshToken(_payload: TokenPayload): Promise<string> {
    throw new Error('TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
  }

  async createAccessToken(_payload: TokenPayload): Promise<string> {
    throw new Error('TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
  }

  async verifyRefreshToken(_token: string): Promise<boolean> {
    throw new Error('TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
  }

  async decodePayload(_token: string): Promise<TokenPayload> {
    throw new Error('TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
  }
}

export default TokenManager;
