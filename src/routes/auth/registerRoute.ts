import express from "express";
import UserController from "../../controllers/UserController";
import TeamsController from "../../controllers/TeamsController";

const router = express.Router()

router.post("/register", async (req, res) => {
    const { email, password }: { email?: string, password?: string } = req.body || {};

    if (!email || !password) {
        res.status(400).send("A username or password must be provided");
        return;
    }

    const {user, token} = await UserController.registerUser(email, password);
    TeamsController.createTeam(user);

    res.status(201).json({user, token});
})

export default router;