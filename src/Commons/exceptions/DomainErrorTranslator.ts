import AuthenticationError from './AuthenticationError.js';
import InvariantError from './InvariantError.js';

type ErrorDirectory = Record<string, Error>;

const directories: ErrorDirectory = {
  'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada',
  ),
  'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'tidak dapat membuat user baru karena tipe data tidak sesuai',
  ),
  'REGISTER_USER.USERNAME_LIMIT_CHAR': new InvariantError(
    'tidak dapat membuat user baru karena karakter username melebihi batas limit',
  ),
  'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER': new InvariantError(
    'tidak dapat membuat user baru karena username mengandung karakter terlarang',
  ),
  'USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'harus mengirimkan username dan password',
  ),
  'USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'username dan password harus string',
  ),
  'USER_LOGIN_USE_CASE.INVALID_CREDENTIALS': new AuthenticationError(
    'password salah',
  ),
  'USER_LOGIN_USE_CASE.USERNAME_NOT_FOUND': new InvariantError(
    'username tidak ditemukan',
  ),
  'REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN':
    new InvariantError('harus mengirimkan token refresh'),
  'REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION':
    new InvariantError('refresh token harus string'),
  'REFRESH_AUTHENTICATION_USE_CASE.INVALID_TOKEN': new InvariantError(
    'refresh token tidak valid',
  ),
  'REFRESH_AUTHENTICATION_USE_CASE.TOKEN_NOT_FOUND': new InvariantError(
    'refresh token tidak ditemukan di database',
  ),
  'DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN':
    new InvariantError('harus mengirimkan token refresh'),
  'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION':
    new InvariantError('refresh token harus string'),
  'ADD_USER_USE_CASE.USERNAME_ALREADY_TAKEN': new InvariantError(
    'username tidak tersedia',
  ),
  'LOGOUT_USER_USE_CASE.REFRESH_TOKEN_NOT_FOUND': new InvariantError(
    'refresh token tidak ditemukan di database',
  ),
};

const DomainErrorTranslator = {
  translate(error: Error): Error {
    return directories[error.message] || error;
  },
};

export default DomainErrorTranslator;
