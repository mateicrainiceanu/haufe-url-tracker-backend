import logger from "../config/logger";
import UserService from "../services/UserServices";
import CustomError from "../utils/CustomError";
import {matchesHash} from "../utils/hash";
import User from "../models/User";

class UserController {

    static async existsWithEmail(email: string) {
        const foundUser = await UserService.getByEmail(email);
        return foundUser !== null;
    }

    static signToken(user: User) {
        return UserService.tokenize(user);
    }

    static async registerUser(email, password) {
        const user = await UserService.createUser(email, password);

        const token = UserService.tokenize(user);

        logger.info(`User created [${user.id}]`);

        return {user, token}
    }

    static async authenticateUser(email, password) {
        const user = await UserService.getByEmail(email);

        if (user === null || !await matchesHash(password, user.hash)) {
            throw new CustomError(400, "Invalid credentials");
        }

        delete user.hash;

        const token = UserService.tokenize(user);

        return {user, token}
    }

    static async queryByEmail(email: string) {
        return UserService.findUsersByPartialEmail(email);
    }

    static async getForGProfile(profile) {
        const email = profile.emails[0].value
        const user = await UserService.getByEmail(email);

        if (!user) {
            const created = UserService.createUser(email, profile.id + Date.now());
            return created;
        } else {
            return user;
        }
    }
}

export default UserController;