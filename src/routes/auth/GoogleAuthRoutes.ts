import express from 'express';
import passport from "../../utils/passport";
import {AuthenticatedRequest} from "../../utils/middleware/auth";
import logger from "../../config/logger";
import UserController from "../../controllers/UserController";
import {clientUrl} from "../../config/global";

const router = express.Router();

router.get("/auth/google", passport.authenticate("google", {scope: ["profile", "email"]}));
router.get(
    "/auth/google/callback",
    passport.authenticate("google", {session: false}),
    (req: AuthenticatedRequest, res) => {
        logger.info(`${req.user.id} [req.user.id] log in with Google`)
        const token = UserController.signToken(req.user);

        res.redirect(`${clientUrl}/auth/token/${token}`);
    }
);

export default router;