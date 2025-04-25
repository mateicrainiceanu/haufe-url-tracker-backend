import express from 'express';
import auth, { AuthenticatedRequest } from '../../utils/middleware/auth';
import team, { AuthUserTeamRequest } from '../../utils/middleware/teamMiddleware';
import TrackerController from '../../controllers/TrackerController';
import RedirectController from '../../controllers/RedirectController';
import logger from '../../config/logger';

const trackerRoutes = express.Router();

trackerRoutes.route("/tracker")
    .get(auth, team, async (req: AuthUserTeamRequest, res) => {
        const team = req.team;

        const trackers = await TrackerController.getForTeam(team);

        res.status(200).json({ trackers });
    })
    .post(auth, async (req, res) => {
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

trackerRoutes.route("/tracker/:trackerId")
    //implement get
    .put(auth, async (req: AuthenticatedRequest, res) => {
        const { trackerId } = req.params;

        if (!req.body)
            return res.status(400).send("Invalid request - body {name, description} is missing");

        const { name, description } = req.body;
        const { user } = req;

        if (!trackerId) {
            logger.error("Request could not be processed - tracker id missing");
            res.status(400).send("Invalid request - tracker id missing");
            return;
        }

        if (!name) {
            logger.error(`Failed to update tracker id [${trackerId}] - name field is mandatory`);
            res.status(400).send("Failed to update tracker; name field is mandatory");
            return;
        }

        try {
            const tracker = await TrackerController.updateTracker(trackerId, user, name, description);
            res.status(200).json({ tracker });
        } catch (error) {
            logger.error(`Failed to update tracker id [${trackerId}] - ${error.message}`);
            res.status(500).send(error.message || "An error occurred");
        }
    })
    .delete(auth, async (req: AuthenticatedRequest, res) => {
        const { trackerId } = req.params;
        const { keepRedirect } = req.query;
        const { user } = req;

        var kr = false;

        if (keepRedirect && keepRedirect == "true") {
            kr = true;
        }

        if (!trackerId) {
            logger.error("Request could not be processed - tracker id missing");
            res.status(400).send("Invalid request - tracker id missing");
            return;
        }

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