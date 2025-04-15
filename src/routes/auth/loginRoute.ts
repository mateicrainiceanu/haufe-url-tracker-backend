import express from "express";
import UserController from "../../controllers/UserController";

const router = express.Router()

router.post("/login", async (req, res) => {
    const { email, password }: { email?: string, password?: string } = req.body || {};

    if (!email || !password) {
        res.status(400).send("A username or password must be provided");
        return;
    }

    try {
        const {user, token} = await UserController.authenticateUser(email, password);
        res.status(200).json({user, token});
    } catch (_) {
        res.status(400).send("Invalid credentials");
    }

})

export default router;