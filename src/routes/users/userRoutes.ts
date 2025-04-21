import express from 'express';
import { AuthenticatedRequest } from '../../utils/middleware/auth';
import UserController from '../../controllers/UserController';

const userRouter = express.Router();

userRouter.get('/user', async (req, res) => {
    const { email } = req.query;

    if (!email) {
        res.status(400).send("An email must be provided");
        return;
    }

    try {
        const users = await UserController.queryByEmail(email as string);
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).send(error.message);
    };
});
export default userRouter;