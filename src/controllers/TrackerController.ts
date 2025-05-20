import Team from "../models/Team";
import User from "../models/User";
import RedirectService from "../services/RedirectService";
import {TrackerService} from "../services/TrackerService";
import CustomError from "../utils/CustomError";
import logger from "../config/logger";

export default class TrackerController {
    static async getForTeam(team: Team) {
        logger.debug(`TrackerController.getForTeam [${team.id}]`);
        return await TrackerService.getTrackersForTeam(team);
    }

    static async createTrackerForTeam(team: Team, url: string, kw: string) {
        logger.debug(`TrackerController.createTrackerForTeam [${team.id}] [${url}] [${kw}]`);
        const redirect = await RedirectService.createRedirect(url, kw);

        const tracker = await TrackerService.createForRedirect(redirect);

        await team.addTracker(tracker);

        return {tracker, redirect};
    }

    static async updateTracker(trackerId: string, user: User, name: string, description?: string) {
        const newdesc = description || null;
        logger.debug(`TrackerController.updateTracker [${trackerId}] [${user.id}] [${name}] [${newdesc}]`);

        if (!name) {
            throw new CustomError(400, "A name is required");
        }

        const tracker = await TrackerService.getTrackerData(trackerId, user);

        return TrackerService.updateTracker(tracker, name, newdesc);
    }

    static async deleteTracker(trackerId: string, user: User, keepRedirect?: boolean) {
        const tracker = await TrackerService.getTrackerData(trackerId, user);
        logger.debug(`TrackerController.deleteTracker [${trackerId}] [${user.id}] [${keepRedirect}]`);

        if (!tracker) {
            throw new CustomError(404, "Tracker not found");
        }


        const redirect = tracker.redirect;

        await TrackerService.deleteTracker(tracker);

        if (!keepRedirect) {
            await RedirectService.deleteRedirect(redirect);
            return;
        }
        return;
    }
}