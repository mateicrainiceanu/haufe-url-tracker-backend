import express from "express";
import { validate as isUUID } from "uuid";
import TeamsController from "../../controllers/TeamsController";
import { AuthenticatedRequest } from "../../utils/middleware/auth";

const teamUserRouter = express.Router();

teamUserRouter.post("/:teamId/user", async (req: AuthenticatedRequest, res) => {
    const { teamId } = req.params;
    const { userId } = req.body;

    if (!userId) {
        res.status(400).send("An email must be provided");
        return;
    }

    if (!teamId || !isUUID(teamId)) {
        res.status(400).send("A team id must be provided");
        return;
    }

    try {
        const team = await TeamsController.addUserToTeam(req.user, teamId, userId);
        res.status(201).json({ team });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

teamUserRouter.delete("/:teamId/user/:userId", async (req: AuthenticatedRequest, res) => {
    const { teamId, userId } = req.params;
    const user = req.user;

    if (!userId) {
        res.status(400).send("An email must be provided");
        return;
    }

    if (!teamId || !isUUID(teamId)) {
        res.status(400).send("A teamid must be provided");
        return;
    }

    try {
        const team = await TeamsController.removeUserFromTeam(user, teamId, userId);
        res.status(200).json({ team });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

export default teamUserRouter;