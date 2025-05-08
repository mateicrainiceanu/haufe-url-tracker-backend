import Team from "../models/Team";
import User from "../models/User";
import RedirectService from "../services/RedirectService";
import {TrackerService} from "../services/TrackerService";
import CustomError from "../utils/CustomError";

export default class TrackerController {
    static async getForTeam(team: Team) {
        return await TrackerService.getTrackersForTeam(team);
    }

    static async updateTracker(trackerId: string, user: User, name: string, description?: string) {
        const newdesc = description || null;

        if (!name) {
            throw new CustomError(400, "A name is required");
        }

        const tracker = await TrackerService.getTrackerData(trackerId, user);

        return TrackerService.updateTracker(tracker, name, newdesc);
    }

    static async deleteTracker(trackerId: string, user: User, keepRedirect?: boolean) {
        const tracker = await TrackerService.getTrackerData(trackerId, user);

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