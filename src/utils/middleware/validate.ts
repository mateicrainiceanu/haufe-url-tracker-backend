import { NextFunction, Request, Response } from "express";
import { ContextRunner } from "express-validator";
import logger from "../../config/logger";

export default function validate(validations: ContextRunner[]) {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        for (const vaidation of validations) {
            const result = await vaidation.run(req);
            if (!result.isEmpty()) {
                const text = result.array()[0].msg
                logger.error(`Validation error [${req.path}] ${text}`);

                res.status(400).send(text);
                return;
            }
        }

        next();
    }
}