import RegisterUser from '../../Domains/users/entities/RegisterUser.js';
import UserRepository from '../../Domains/users/UserRepository.js';
import PasswordHash from '../security/PasswordHash.js';

export interface AddUserUseCasePayload {
  username: string;
  password: string;
  fullname: string;
}

interface AddUserUseCaseResult {
  id: string;
  username: string;
  fullname: string;
}

class AddUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHash: PasswordHash,
  ) {}

  async execute(payload: AddUserUseCasePayload): Promise<AddUserUseCaseResult> {
    const registerUser = new RegisterUser(payload);

    const isAvailable = await this.userRepository.verifyAvailableUsername(
      registerUser.username,
    );

    if (isAvailable) {
      throw new Error('ADD_USER_USE_CASE.USERNAME_ALREADY_TAKEN');
    }

    const hashedPassword = await this.passwordHash.hash(registerUser.password);

    const registeredUser = await this.userRepository.addUser({
      username: registerUser.username,
      password: hashedPassword,
      fullname: registerUser.fullname,
    });

    return {
      id: registeredUser.id,
      username: registeredUser.username,
      fullname: registeredUser.fullname,
    };
  }
}

export default AddUserUseCase;
