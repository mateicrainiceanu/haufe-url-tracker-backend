import { Request } from 'express';
import { decode } from 'jsonwebtoken';
import { AuthUser, decodeToken } from '../decodeToken';
import logger from '../../config/logger';
import User from '../../models/User';

export interface AuthenticatedRequest extends Request {
    headers: {
        authorization?: string;
        [key: string]: any;
    };
    user: User;
    [key: string]: any;
}

export default async function auth(req: AuthenticatedRequest, res, next) {
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
        const usr = decodeToken(bearerToken);

        const user = await User.findByPk(usr.id);

        if (!user) {
            res.status(401).send('Invalid user token: User does not exist');
            return;
        }

        req.user = user

        logger.info(`User [${req.user.id}] verified`);
        next();
    } catch (error) {
        res.status(401).send(error.message);
        logger.error(`Error decoding token: ${error.message}`);
        return;
    }
}