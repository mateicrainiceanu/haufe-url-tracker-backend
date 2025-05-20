import express from 'express';
import auth from "../../utils/middleware/auth";

const router = express.Router();

router.get('/auth/user-data', auth, (req, res) => {
    res.status(200).json({user: req.user, token: req.token})
})

export default router;


