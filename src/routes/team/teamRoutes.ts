import express from "express";
import auth, { AuthenticatedRequest } from "../../utils/middleware/auth";

const teamRoutes = express.Router();

teamRoutes.route("/teams")
    .get(async (req: AuthenticatedRequest, res) => {
        const user = req.user;
        const teams = await user.getTeams();
        res.status(200).json({ teams });
    });

export default teamRoutes;