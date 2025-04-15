import UserService from "../services/UserServices";

class UserController {
    static async registerUser(email, password) { 
        const user = await UserService.createUser(email, password);

        const token = await UserService.tokenize(user);
        
        return {user, token}
    }

}

export default UserController;