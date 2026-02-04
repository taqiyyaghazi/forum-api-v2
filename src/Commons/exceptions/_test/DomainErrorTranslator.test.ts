import { describe, expect, it } from 'vitest';
import DomainErrorTranslator from '../DomainErrorTranslator.js';
import InvariantError from '../InvariantError.js';

describe('DomainErrorTranslator', () => {
  it('should translate error correctly', () => {
    expect(
      DomainErrorTranslator.translate(
        new Error('REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY'),
      ),
    ).toBeInstanceOf(InvariantError);

    expect(
      DomainErrorTranslator.translate(
        new Error('REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION'),
      ),
    ).toBeInstanceOf(InvariantError);

    expect(
      DomainErrorTranslator.translate(
        new Error('REGISTER_USER.USERNAME_LIMIT_CHAR'),
      ),
    ).toBeInstanceOf(InvariantError);

    expect(
      DomainErrorTranslator.translate(
        new Error('REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER'),
      ),
    ).toBeInstanceOf(InvariantError);

    expect(
      DomainErrorTranslator.translate(
        new Error('USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY'),
      ),
    ).toBeInstanceOf(InvariantError);

    expect(
      DomainErrorTranslator.translate(
        new Error('USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION'),
      ),
    ).toBeInstanceOf(InvariantError);

    expect(
      DomainErrorTranslator.translate(
        new Error('REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN'),
      ),
    ).toBeInstanceOf(InvariantError);

    expect(
      DomainErrorTranslator.translate(
        new Error(
          'REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION',
        ),
      ),
    ).toBeInstanceOf(InvariantError);

    expect(
      DomainErrorTranslator.translate(
        new Error('DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN'),
      ),
    ).toBeInstanceOf(InvariantError);

    expect(
      DomainErrorTranslator.translate(
        new Error(
          'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION',
        ),
      ),
    ).toBeInstanceOf(InvariantError);
  });

  it('should return original error when error message is not listed in directories', () => {
    // Arrange
    const error = new Error('some_error_message');

    // Action
    const translatedError = DomainErrorTranslator.translate(error);

    // Assert
    expect(translatedError).toEqual(error);
  });
});
