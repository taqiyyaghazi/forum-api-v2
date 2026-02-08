import AuthenticationRepository from '../../Domains/authentications/AuthenticationRepository.js';
import RefreshToken from '../../Domains/authentications/entities/RefreshToken.js';

export interface LogoutUserUseCasePayload {
  refreshToken: string;
}

class LogoutUserUseCase {
  constructor(
    private readonly authenticationRepository: AuthenticationRepository,
  ) {}

  async execute(payload: LogoutUserUseCasePayload): Promise<void> {
    const { refreshToken } = new RefreshToken(payload);

    const isAvailable =
      await this.authenticationRepository.checkAvailabilityToken(refreshToken);

    if (!isAvailable) {
      throw new Error('LOGOUT_USER_USE_CASE.REFRESH_TOKEN_NOT_FOUND');
    }

    await this.authenticationRepository.deleteToken(refreshToken);
  }
}

export default LogoutUserUseCase;
