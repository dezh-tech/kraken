import type { Request } from 'express';

import type { IAuthLoginInput } from './interfaces/auth-login-input.interface';

export interface IAuthenticatedRequest extends Request {
  user: IAuthLoginInput;
}
