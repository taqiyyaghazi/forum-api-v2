import 'express';

declare module 'express' {
  interface Request {
    auth?: {
      id: string;
    };
  }
}
