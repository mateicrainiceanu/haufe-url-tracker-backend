import express from "express";
import UserController from "../../controllers/UserController";
import TeamsController from "../../controllers/TeamsController";
import validate from "../../utils/middleware/validate";
import { body } from "express-validator";

const router = express.Router()

router.post("/register", validate([
    body("email").isEmail().withMessage("Email is required"),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters long")
]), async (req, res) => {
    const { email, password }: { email?: string, password?: string } = req.body;

    //const check tthat the user with this email does not exist
    if (await UserController.existsWithEmail(email)) {
        res.status(400).send("User with this email already exists");
        return;
    }

    const { user, token } = await UserController.registerUser(email, password);
    TeamsController.createTeam(user);

    res.status(201).json({ user, token });
})

export default router;