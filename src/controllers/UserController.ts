import logger from "../config/logger";
import UserService from "../services/UserServices";
import CustomError from "../utils/CustomError";
import { matchesHash } from "../utils/hash";

class UserController {

    static async existsWithEmail(email: string) {
        const foundUser = await UserService.getByEmail(email);
        return foundUser !== null;
    }

    static async registerUser(email, password) {
        const user = await UserService.createUser(email, password);

        const token = await UserService.tokenize(user);

        logger.info(`User created [${user.id}]`);

        return { user, token }
    }

    static async authenticateUser(email, password) {
        const user = await UserService.getByEmail(email);

        if (user === null || !await matchesHash(password, user.hash)) {
            throw new CustomError(400, "Invalid credentials");
        }

        delete user.hash;

        const token = UserService.tokenize(user);

        return { user, token }
    }

    static async queryByEmail(email: string) {
        return UserService.findUsersByPartialEmail(email);
    }
}

export default UserController;