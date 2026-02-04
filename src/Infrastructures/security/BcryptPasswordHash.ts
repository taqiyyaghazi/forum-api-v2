import bcrypt from 'bcrypt';
import PasswordHash from '../../Applications/security/PasswordHash.js';

class BcryptPasswordHash extends PasswordHash {
  constructor(
    private readonly _bcrypt: typeof bcrypt,
    private readonly saltRound: number = 10,
  ) {
    super();
  }

  async hash(password: string): Promise<string> {
    return this._bcrypt.hash(password, this.saltRound);
  }

  async compare(plain: string, encrypted: string): Promise<boolean> {
    return this._bcrypt.compare(plain, encrypted);
  }
}

export default BcryptPasswordHash;
