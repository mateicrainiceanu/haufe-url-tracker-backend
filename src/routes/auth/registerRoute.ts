import express from "express";
import User from "../../respositories/UserRepository";

const router = express.Router()

router.post("/register", async (req, res) => {
    const { email, password }: { email?: string, password?: string } = req.body || {};

    if (!email || !password) {
        res.status(400).send("A username or password must be provided");
        return;
    }

    const user = await User.create({ email, hash: password });
    console.log(user);


    //TODO: Create user and respond with a 200 and token
    res.status(200).send("Not implemented");
})

export default router;