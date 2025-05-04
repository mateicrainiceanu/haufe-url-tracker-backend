import express from 'express';
import UserController from '../../controllers/UserController';
import auth from '../../utils/middleware/auth';
import validate from '../../utils/middleware/validate';
import { query } from 'express-validator';

const userRouter = express.Router();

userRouter.get('/user', auth, validate([
    query("email").isString().isLength({ min: 3 }).withMessage("Email must be at least 3 characters long")
]), async (req, res) => {
    
    const { email } = req.query;

    try {
        const users = await UserController.queryByEmail(email as string);
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).send(error.message);
    };
});
export default userRouter;