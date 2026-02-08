import AuthenticationRepository from '../../Domains/authentications/AuthenticationRepository.js';
import NewAuth from '../../Domains/authentications/entities/NewAuth.js';
import UserLogin from '../../Domains/users/entities/UserLogin.js';
import UserRepository from '../../Domains/users/UserRepository.js';
import TokenManager from '../security/TokenManager.js';
import PasswordHash from '../security/PasswordHash.js';

export interface LoginUserUseCasePayload {
  username: string;
  password: string;
}

interface LoginUserUseCaseResult {
  accessToken: string;
  refreshToken: string;
}

class LoginUserUseCase {
  constructor(
    private readonly authenticationRepository: AuthenticationRepository,
    private readonly tokenManager: TokenManager,
    private readonly userRepository: UserRepository,
    private readonly passwordHash: PasswordHash,
  ) {}

  async execute(
    payload: LoginUserUseCasePayload,
  ): Promise<LoginUserUseCaseResult> {
    const { username, password } = new UserLogin(payload);

    const userCredentials =
      await this.userRepository.getCredentialsByUsername(username);

    if (!userCredentials) {
      throw new Error('USER_LOGIN_USE_CASE.USERNAME_NOT_FOUND');
    }

    const isPasswordValid = await this.passwordHash.compare(
      password,
      userCredentials.password,
    );

    if (!isPasswordValid) {
      throw new Error('USER_LOGIN_USE_CASE.INVALID_CREDENTIALS');
    }

    const accessToken = await this.tokenManager.createAccessToken({
      id: userCredentials.id,
    });

    const refreshToken = await this.tokenManager.createRefreshToken({
      id: userCredentials.id,
    });

    const newAuthentication = new NewAuth({
      accessToken,
      refreshToken,
    });

    await this.authenticationRepository.addToken(refreshToken);

    return newAuthentication;
  }
}

export default LoginUserUseCase;
