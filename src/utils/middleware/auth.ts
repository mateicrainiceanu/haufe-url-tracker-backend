import {Request} from 'express';
import {decodeToken} from '../decodeToken';
import logger from '../../config/logger';
import User from '../../models/User';

export interface AuthenticatedRequest extends Request {
    headers: {
        authorization?: string;
        [key: string]: any;
    };
    user: User;
    token: string;

    [key: string]: any;
}

export default async function auth(req: AuthenticatedRequest, res, next) {
    const token = req.get('authorization');
    if (!token) {
        res.status(401).send('User not authenticated');
        return;
    }
    ;

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

        delete user.hash

        req.user = user
        req.token = bearerToken;

        logger.debug(`User [${req.user.id}] verified for [${req.method}] at [${req.path}]`);
        next();
    } catch (error) {
        res.status(401).send(error.message);
        logger.error(`Error decoding token: ${error.message}`);
        return;
    }
}