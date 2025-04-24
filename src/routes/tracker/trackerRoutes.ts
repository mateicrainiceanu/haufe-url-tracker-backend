import express from 'express';
import auth from '../../utils/middleware/auth';
import team, { AuthUserTeamRequest } from '../../utils/middleware/teamMiddleware';
import TrackerController from '../../controllers/TrackerController';

const trackerRoutes = express.Router();

trackerRoutes.route("/tracker")
.get(auth, team, async (req: AuthUserTeamRequest, res) => {
    const team = req.team;

    const trackers = await TrackerController.getForTeam(team);

    res.status(200).json({ trackers });
});

export default trackerRoutes;