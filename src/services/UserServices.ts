import { hashPassword } from "../utils/hash";
import User from "../models/User";
import jwt from "jsonwebtoken";
import { jwtsecret } from "../config/global";
import Team from "../models/Team";
import { Op } from "sequelize";

export default class UserService {

    static async createUser(email, password) {
        const hash = await hashPassword(password);
        return User.create({ email, hash });
    }

    static getByEmail(email) {
        return User.findOne({ where: { email } });

    }

    static tokenize(user: User) {
        const payload = user.get({ plain: true });
        delete payload.hash;
        return jwt.sign(payload, jwtsecret);
    }

    static getUsername(user: User) {
        return user.email.split("@")[0];
    }

    static findUsersByPartialEmail(email: string) {
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