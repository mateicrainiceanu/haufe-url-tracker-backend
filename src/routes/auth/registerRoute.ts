import express from "express";
import User from "../../models/User";

const router = express.Router()

router.post("/register", (req, res) => {
    const { email, password }: { email?: string, password?: string } = req.body || {};

    if (!email || !password) {
        res.status(400).send("A username or password must be provided");
        return;
    }

    const user = new User();

    //TODO: Create user and respond with a 200 and token
    res.status(200).send("Not implemented");
})

export default router;