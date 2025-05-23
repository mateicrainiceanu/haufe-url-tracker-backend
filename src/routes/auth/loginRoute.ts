import express from "express";
import UserController from "../../controllers/UserController";
import logger from "../../config/logger";
import validate from "../../utils/middleware/validate";
import {body} from "express-validator";

const router = express.Router()

router.post("/login", validate([
    body("email").isEmail().withMessage("Email is required"),
    body("password").isString().withMessage("Password is required")
]), async (req, res) => {
    const {email, password}: { email?: string, password?: string } = req.body || {};

    const {user, token} = await UserController.authenticateUser(email, password);
    logger.info(`User [${user.id}] authenticated`);
    res.cookie("token", token, {httpOnly: true});
    res.status(200).json({user, token});

})

export default router;