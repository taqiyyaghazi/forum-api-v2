import AuthenticationError from './AuthenticationError.js';
import InvariantError from './InvariantError.js';
import NotFoundError from './NotFoundError.js';

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
    'kredensial yang Anda masukkan salah',
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
  'REFRESH_TOKEN.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'harus mengirimkan token refresh',
  ),
  'REFRESH_TOKEN.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'refresh token harus string',
  ),
  'NEW_THREAD.NOT_CONTAIN_PAYLOAD': new InvariantError(
    'tidak dapat membuat thread baru karena payload yang dibutuhkan tidak ada',
  ),
  'NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada',
  ),
  'NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'tidak dapat membuat thread baru karena tipe data tidak sesuai',
  ),
  'NEW_COMMENT.NOT_CONTAIN_PAYLOAD': new InvariantError(
    'tidak dapat membuat comment baru karena payload yang dibutuhkan tidak ada',
  ),
  'NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'tidak dapat membuat comment baru karena properti yang dibutuhkan tidak ada',
  ),
  'NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'tidak dapat membuat comment baru karena tipe data tidak sesuai',
  ),
  'ADD_COMMENT_USE_CASE.THREAD_NOT_FOUND': new NotFoundError(
    'thread tidak ditemukan',
  ),
  'GET_THREAD_DETAIL_USE_CASE.THREAD_NOT_FOUND': new NotFoundError(
    'thread tidak ditemukan',
  ),
};

const DomainErrorTranslator = {
  translate(error: Error): Error {
    return directories[error.message] || error;
  },
};

export default DomainErrorTranslator;
