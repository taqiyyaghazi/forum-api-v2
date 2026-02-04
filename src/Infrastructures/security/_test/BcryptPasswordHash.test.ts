import BcryptPasswordHash from '../BcryptPasswordHash.js';
import bcrypt from 'bcrypt';

describe('BcryptPasswordHash', () => {
  describe('hash function', () => {
    it('should create hash correctly', async () => {
      // Arrange
      const spyHash = vi.spyOn(bcrypt, 'hash');
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);

      // Action
      const hash = await bcryptPasswordHash.hash('password');

      // Assert
      expect(typeof hash).toBe('string');
      expect(hash).not.toBe('password');
      expect(spyHash).toHaveBeenCalledWith('password', 10);
    });
  });

  describe('compare function', () => {
    it('should return false when comparison failed', async () => {
      // Arrange
      const spyCompare = vi.spyOn(bcrypt, 'compare');
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);

      // Action
      const isVerified = await bcryptPasswordHash.compare('password', 'hash');

      // Assert
      expect(isVerified).toBe(false);
      expect(spyCompare).toHaveBeenCalledWith('password', 'hash');
    });

    it('should return true when comparison success', async () => {
      // Arrange
      const spyCompare = vi.spyOn(bcrypt, 'compare');
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);
      const plainPassword = 'secret';
      const encryptedPassword = await bcryptPasswordHash.hash(plainPassword);

      // Action
      const isVerified = await bcryptPasswordHash.compare(
        plainPassword,
        encryptedPassword,
      );

      // Assert
      expect(isVerified).toBe(true);
      expect(spyCompare).toHaveBeenCalledWith('password', 'hash');
    });
  });
});
