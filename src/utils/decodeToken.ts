import jwt from 'jsonwebtoken';
import { jwtsecret } from '../config/global';
import logger from '../config/logger';

export interface AuthUser {
    id: string;
    email: string;
}

export function decodeToken(token: string): AuthUser {

    const decoded = jwt.verify(token, jwtsecret) as AuthUser;

    if (!decoded) {
        logger.error('Invalid token: Request is unauthorized');
        throw new Error('Invalid token: Request is unauthorized');
    }
    
    return decoded;
}