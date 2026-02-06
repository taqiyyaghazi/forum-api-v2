import { describe, expect, it } from 'vitest';
import PasswordHash from '../PasswordHash.js';

describe('PasswordHash interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const passwordHash = new PasswordHash();

    // Action and Assert
    await expect(passwordHash.hash('dummy')).rejects.toThrowError(
      'PASSWORD_HASH.METHOD_NOT_IMPLEMENTED',
    );
    await expect(
      passwordHash.compare('plain', 'encrypted'),
    ).rejects.toThrowError('PASSWORD_HASH.METHOD_NOT_IMPLEMENTED');
  });
});
