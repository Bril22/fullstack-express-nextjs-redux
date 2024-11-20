import { Request } from 'express';
import { User } from '../interfaces';

export interface AuthRequest extends Request {
    user?: User;
}