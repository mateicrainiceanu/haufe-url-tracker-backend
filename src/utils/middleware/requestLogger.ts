import {NextFunction, Request, Response} from "express"
import logger from "../../config/logger";

function requestLogger(req: Request, _: Response, next: NextFunction) {
    logger.trace(`[${req.method} ${req.path}] params: [${JSON.stringify(req.params)}] body: [${JSON.stringify(req.body)}] query: [${JSON.stringify(req.query)}]`);
    next();
}

export {requestLogger};