/* eslint-disable @typescript-eslint/no-unused-vars */
class PasswordHash {
  async hash(_password: string): Promise<string> {
    throw new Error('PASSWORD_HASH.METHOD_NOT_IMPLEMENTED');
  }

  async compare(_plain: string, _encrypted: string): Promise<boolean> {
    throw new Error('PASSWORD_HASH.METHOD_NOT_IMPLEMENTED');
  }
}

export default PasswordHash;
