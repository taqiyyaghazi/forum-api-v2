abstract class ClientError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode: number = 400) {
    super(message);

    this.statusCode = statusCode;
    this.name = 'ClientError';

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export default ClientError;
