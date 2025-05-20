import express from "express";
import {authDev, TeamApiReq} from "../../utils/middleware/authDev";
import validate from "../../utils/middleware/validate";
import {body, param} from "express-validator";
import {validate as isValidUUID} from "uuid";
import TrackerController from "../../controllers/TrackerController";
import AccessController from "../../controllers/AccessController";

const trackerDevRouter = express.Router({mergeParams: true});

trackerDevRouter.get("/tracker/:trackerId", validate([
    param("trackerId").isString().custom(isValidUUID).withMessage("Tracker id is required and must be a valid UUID")
]), authDev, async (req: TeamApiReq, res) => {

    const {trackerId} = req.params;

    const {tracker, accessLogs} = await AccessController.getAccessDataDev(trackerId, req.apiTeam);
    res.status(200).json({tracker, accessLogs});
});

trackerDevRouter.post("/tracker", validate([
    body("url").isURL().withMessage("A URL should be provided"),
    param("apiKey").isString().custom(isValidUUID).withMessage("A valid api key should be provided as param")
]), authDev, async (req: TeamApiReq, res) => {
    const {
        tracker,
        redirect
    } = await TrackerController.createTrackerForTeam(req.apiTeam, req.body.url, req.body.keyword);

    res.json({tracker: {...tracker.get({plain: true}), redirect}});
});

export default trackerDevRouter;