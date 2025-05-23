import logger from "../../config/logger";
import TeamsController from "../../controllers/TeamsController";
import Team from "../../models/Team";
import {AuthenticatedRequest} from "./auth";
import {validate as isUUID} from "uuid";

export interface AuthUserTeamRequest extends AuthenticatedRequest {
    team: Team;
}

export default async function team(req, res, next) {
    const teamId = req.query.teamId || req.body.teamId;

    if (!teamId && !isUUID(teamId)) {
        logger.error(`No team id or invalid teamId [${teamId || ""}] passed as param`);
        res.status(400).send("A team id must be passed as param");
        return;
    }

    const user = req.user;

    try {
        const team = await TeamsController.getFullTeamForUser(teamId, user);
        if (!team) {
            res.status(400).send("Team was not found");
            return;
        }
        req.team = team;

        next();

    } catch (error) {
        logger.error(`Error getting team: ${error.message}`);
        res.status(400).send(error.message);
        return;
    }
}