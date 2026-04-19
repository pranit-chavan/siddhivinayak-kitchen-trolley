import { Request } from 'express';

export type AuthenticatedUser = {
  sub: string;
  email: string;
  role: string;
  name: string;
};

export interface RequestWithUser extends Request {
  user: AuthenticatedUser;
}
