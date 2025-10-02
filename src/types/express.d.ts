import { User } from '@prisma/client';

declare module 'express' {
  interface Request {
    user?: {
      id: string;
      roles: string[];
    };
  }
}