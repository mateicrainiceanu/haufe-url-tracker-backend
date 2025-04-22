
import { NextFunction, Request, Response } from 'express';

import RedirectController from '../../controllers/RedirectController';
import { AuthenticatedRequest } from '../../utils/middleware/auth';

export function requestHandler(req: Request, res: Response, next: NextFunction) {

    if (!req.body) {
        res.status(400).send('Bad Request: No body provided');
        return;
    }

    const { url } = req.body;
    if (!url) {
        res.status(400).send('Bad Request: No URL provided');
        return;
    }

    const token = req.get('authorization');
    if (!token) {
        unauthCreateRedirect(req, res, next);
        return;
    }

    next();
}

async function unauthCreateRedirect(req: Request, res: Response, next: NextFunction) {
    const { url, keyword } = req.body;

    try {

        const redirect = await RedirectController.createRedirect(url, keyword);
        res.status(201).json({ redirect });

    } catch (error) {
        if (error.message == "Validation error") {
            res.status(400).send("Invalid short word. Please try another one");
            return;
        }
        res.status(500).send(error.message || "An error occurred");
        return;
    }

}

export async function createAuthRequest(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const { url, keyword, teamId} = req.body;

    if (!teamId) {
        const redirect = await RedirectController.createRedirect(url, keyword);
        res.status(201).json({redirect});
        return;
    }

    try {
        const redirect = await RedirectController.createRedirect(url, keyword, teamId, req.user);
        res.status(201).json({ redirect });
    } catch (error) {
        if (error.message == "Validation error") {
            res.status(400).send("Invalid short word. Please try another one");
            return;
        }
        res.status(500).send(error.message || "An error occurred");
        return;
    }

}