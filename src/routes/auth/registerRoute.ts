import express from "express";
import UserController from "../../controllers/UserController";
import TeamsController from "../../controllers/TeamsController";
import validate from "../../utils/middleware/validate";
import {body} from "express-validator";
import CustomError from "../../utils/CustomError";

const router = express.Router()

router.post("/register", validate([
    body("email").isEmail().withMessage("Email is required"),
    body("password").isString().isLength({min: 8}).withMessage("Password must be at least 8 characters long")
]), async (req, res) => {
    const {email, password}: { email?: string, password?: string } = req.body;

    if (await UserController.existsWithEmail(email)) {
        throw new CustomError(400, "User with this email already exists");
    }

    const {user, token} = await UserController.registerUser(email, password);
    await TeamsController.createTeam(user);

    res.status(201).json({user, token});
});

export default router;