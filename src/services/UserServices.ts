import { hashPassword } from "../utils/hash";
import User from "../models/User";
import jwt from "jsonwebtoken";
import { jwtsecret } from "../config/global";
import Team from "../models/Team";
import { Op } from "sequelize";
import logger from "../config/logger";

export default class UserService {

    static async createUser(email, password) {
        logger.trace("UserService.createUser");
        const hash = await hashPassword(password);
        return User.create({ email, hash });
    }

    static getByEmail(email) {
        logger.trace("UserService.getByEmail");
        return User.findOne({ where: { email } });
    }

    static tokenize(user: User) {
        logger.trace("UserService.tokenize");
        const payload = user.get({ plain: true });
        delete payload.hash;
        return jwt.sign(payload, jwtsecret);
    }

    static getUsername(user: User) {
        logger.trace("UserService.getUsername");
        return user.email.split("@")[0];
    }

    static findUsersByPartialEmail(email: string) {
        logger.trace(`UserService.findUsersByPartialEmail [${email}]`);
        return User.findAll({
            where: {
                email: {
                    [Op.iLike]: `%${email}%`
                }
            },
            limit: 5,
        });
    }
}