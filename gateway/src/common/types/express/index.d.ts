import 'express';

declare module 'express-serve-static-core' {
  interface User {
    userId: string;
    role: string;
  }

  export interface Request {
    user?: User;
  }
}
