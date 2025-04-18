import { Request } from 'express';
import { decode } from 'jsonwebtoken';
import { AuthUser, decodeToken } from '../decodeToken';

interface AuthenticatedRequest extends Request {
    headers: {
        authorization?: string;
        [key: string]: any; 
    };
    user: AuthUser;
    [key: string]: any;
}

export default function auth(req: AuthenticatedRequest, res, next) {
    const token = req.get('authorization');
    if (!token) {
        res.status(401).send('User not authenticated');
        return;
    };

    const bearerToken = token.split('Bearer ')[1];
    if (!bearerToken) {
        res.status(401).send('User not authenticated');
        return;
    }

    try {
        req.user = decodeToken(bearerToken);
        next();
    } catch (error) {
        res.status(401).send(error.message);
        return;
    }
}