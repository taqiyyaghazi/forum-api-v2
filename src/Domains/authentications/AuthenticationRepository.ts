/* eslint-disable @typescript-eslint/no-unused-vars */
export interface AddTokenPayload {
  accessToken: string;
  refreshToken: string;
}

class AuthenticationRepository {
  async addToken(_token: string): Promise<void> {
    throw new Error('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async checkAvailabilityToken(_token: string): Promise<boolean> {
    throw new Error('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async deleteToken(_token: string): Promise<void> {
    throw new Error('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

export default AuthenticationRepository;
