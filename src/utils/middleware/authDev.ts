import {NextFunction, Request, Response} from "express";
import logger from "../../config/logger";
import DevKeysController from "../../controllers/DevKeysController";
import Team from "../../models/Team";

export interface TeamApiReq extends Request {
    apiTeam: Team;
}

export async function authDev(req: TeamApiReq, res: Response, next: NextFunction) {

    logger.trace(`[auth-dev] key: ${req.params.apiKey.slice(0, 6)}`);

    try {
        req.apiTeam = await DevKeysController.getTeamForKey(req.params.apiKey);
    } catch (error) {
        logger.error(`[auth-dev] error: ${error.message}`);
        res.status(401).send("Invalid API key");
        return;
    }

    if (!req.apiTeam) {
        res.status(401).send("Invalid API key");
        return;
    }

    next();
}