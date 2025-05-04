import express from 'express';
import auth, { AuthenticatedRequest } from '../../utils/middleware/auth';
import team, { AuthUserTeamRequest } from '../../utils/middleware/teamMiddleware';
import TrackerController from '../../controllers/TrackerController';
import RedirectController from '../../controllers/RedirectController';
import logger from '../../config/logger';
import validate from "../../utils/middleware/validate";
import { body, param } from 'express-validator';
import { validate as isValidUUID } from 'uuid';
import AccessController from '../../controllers/AccessController';

const trackerRoutes = express.Router();

trackerRoutes.route("/tracker")
    .get(auth, team, async (req: AuthUserTeamRequest, res) => {
        const team = req.team;
        const trackers = await TrackerController.getForTeam(team);
        res.status(200).json({ trackers });
    })
    .post(auth, validate([
        body("url").isURL().withMessage("URL is required and must be a valid URL"),
    ]), async (req, res) => {
        const { keyword, url, teamId, name, description } = req.body;
        const { user } = req;

        try {
            const response = await RedirectController.createRedirect(url, keyword, teamId, user, name, description);
            res.status(201).json(response);
        } catch (error) {
            if (error.message == "Validation error") {
                res.status(400).send("Invalid short word. Please try another one");
                return;
            }
            res.status(500).send(error.message || "An error occurred");
            return;
        }
    });

trackerRoutes.get("/tracker/:trackerId/access-logs", auth, validate([
    param("trackerId").isString().custom(isValidUUID).withMessage("Tracker id is required and must be a valid UUID")
]), async (req: AuthenticatedRequest, res) => {
    const { trackerId } = req.params;
    const { user } = req;

    try {
        const { tracker, accessLogs } = await AccessController.getAccessData(trackerId, user);
        res.status(200).json({ tracker, accessLogs });
    } catch (error) {
        logger.error(`Failed to get tracker id [${trackerId}] - ${error.message}`);
        res.status(500).send(error.message || "An error occurred");
    }
});

trackerRoutes.route("/tracker/:trackerId")
    .put(auth,
        validate([
            param("trackerId").isString().custom(isValidUUID).withMessage("Tracker id is required and must be a valid UUID"),
            body("name").notEmpty().withMessage("Name is required"),
            body("description").optional().isString().withMessage("Description must be a string or empty")
        ]), async (req: AuthenticatedRequest, res) => {
            const { trackerId } = req.params;

            if (!req.body)
                return res.status(400).send("Invalid request - body {name, description} is missing");

            const { name, description } = req.body;
            const { user } = req;

            try {
                const tracker = await TrackerController.updateTracker(trackerId, user, name, description);
                res.status(200).json({ tracker });
            } catch (error) {
                logger.error(`Failed to update tracker id [${trackerId}] - ${error.message}`);
                res.status(500).send(error.message || "An error occurred");
            }
        })
    .delete(auth,
        validate([
            param("trackerId").isString().custom(isValidUUID).withMessage("Tracker id is required and must be a valid UUID")
        ]),

        async (req: AuthenticatedRequest, res) => {
            const { trackerId } = req.params;
            const { keepRedirect } = req.query;
            const { user } = req;

            const kr = keepRedirect && keepRedirect == "true";

            try {
                await TrackerController.deleteTracker(trackerId, user, kr);
                logger.info(`Tracker id [${trackerId}] deleted`);
                res.status(204).send();
            } catch (error) {
                logger.error(`Failed to delete tracker id [${trackerId}] - ${error.message}`);
                res.status(500).send(error.message || "An error occurred");
            }
        });

export default trackerRoutes;