/* eslint-disable @typescript-eslint/no-unused-vars */
export interface RegisterUser {
  username: string;
  password: string;
  fullname: string;
}

export interface RegisteredUser {
  id: string;
  username: string;
  fullname: string;
}

export interface UserCredentials {
  id: string;
  password: string;
}

class UserRepository {
  async addUser(_registerUser: RegisterUser): Promise<RegisteredUser> {
    throw new Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyAvailableUsername(_username: string): Promise<boolean> {
    throw new Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getCredentialsByUsername(
    _username: string,
  ): Promise<UserCredentials | null> {
    throw new Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

export default UserRepository;
