import {NextFunction, Request, Response} from "express";
import logger from "../../config/logger";

export function authDev(req: Request, res: Response, next: NextFunction) {

    logger.trace(`[auth-dev] key: ${req.params.apiKey.slice(0, 6)}`);

    if (req.params.apiKey === "api-key") {
        next();
        return;
    }

    res.status(401).send("Unauthorized");
}