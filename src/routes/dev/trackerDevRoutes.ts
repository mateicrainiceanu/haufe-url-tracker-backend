import express from "express";
import {authDev} from "../../utils/middleware/authDev";
import validate from "../../utils/middleware/validate";
import {param} from "express-validator";
import {validate as isValidUUID} from "uuid";

const trackerDevRouter = express.Router({mergeParams: true});

trackerDevRouter.get("/tracker/:trackerId", authDev, validate([
    param("trackerId").isString().custom(isValidUUID).withMessage("Tracker id is required and must be a valid UUID")
]), (req, res) => {

    const {trackerId} = req.params;

    // try {
    //     const {tracker, accessLogs} = await AccessController.getAccessDataDev(trackerId, req.t);
    //     res.status(200).json({tracker, accessLogs});
    // } catch (error) {
    //     logger.error(`Failed to get tracker id [${trackerId}] - ${error.message}`);
    //     res.status(500).send(error.message || "An error occurred");
    // }

    res.send("Hello World");
})

trackerDevRouter.post("/tracker", authDev, (req, res) => {
    res.send("Hello World");
});

export default trackerDevRouter;