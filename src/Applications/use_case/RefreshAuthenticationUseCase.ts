import AuthenticationRepository from '../../Domains/authentications/AuthenticationRepository.js';
import RefreshToken from '../../Domains/authentications/entities/RefreshToken.js';
import TokenManager from '../security/TokenManager.js';

export interface RefreshAuthenticationUseCasePayload {
  refreshToken: string;
}

interface RefreshAuthenticationUseCaseResult {
  accessToken: string;
}

class RefreshAuthenticationUseCase {
  constructor(
    private readonly authenticationRepository: AuthenticationRepository,
    private readonly tokenManager: TokenManager,
  ) {}

  async execute(
    payload: RefreshAuthenticationUseCasePayload,
  ): Promise<RefreshAuthenticationUseCaseResult> {
    const { refreshToken } = new RefreshToken(payload);

    const isRefreshTokenValid =
      await this.tokenManager.verifyRefreshToken(refreshToken);

    if (!isRefreshTokenValid) {
      throw new Error('REFRESH_AUTHENTICATION_USE_CASE.INVALID_TOKEN');
    }

    const isAvailable =
      await this.authenticationRepository.checkAvailabilityToken(refreshToken);

    if (!isAvailable) {
      throw new Error('REFRESH_AUTHENTICATION_USE_CASE.TOKEN_NOT_FOUND');
    }

    const { id } = await this.tokenManager.decodePayload(refreshToken);

    const accessToken = await this.tokenManager.createAccessToken({
      id,
    });

    return {
      accessToken,
    };
  }
}

export default RefreshAuthenticationUseCase;
