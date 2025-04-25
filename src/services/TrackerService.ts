import logger from "../config/logger";
import Redirect from "../models/Redirect";
import Team from "../models/Team";
import Tracker from "../models/Tracker";
import User from "../models/User";
import { TeamService } from "./TeamService";

export class TrackerService {

    static async createForRedirect(redirect: Redirect, optName?: string, optDescription?: string) {
        logger.trace(`TrackerService.createForRedirect [${redirect.id}]`);
        const name = optName || redirect.keyword + " " + redirect.url;
        const description = optDescription || null;
        const tracker = await Tracker.create({ name, description, redirectId: redirect.id });

        return tracker;
    }

    static getTrackersForTeam(team: Team) {
        logger.trace(`TrackerService.getTrackersForTeam [${team.id}]`);
        return team.getTrackers({
            include: [
                {
                    model: Redirect,
                    as: 'redirect'
                }
            ]
        });
    }

    static checkTrackerOwnership(tracker: Tracker, user: User) {
        logger.trace(`TrackerService.checkTrackerOwnership [${tracker.id}] [${user.id}]`);
        if (TeamService.userHasPermissionsOnTeam(user, tracker.team)) {
            return true;
        }
    }

    private static getFullTracker(trackerId: string) {
        logger.trace(`[private] TrackerService.getFullTracker [${trackerId}]`);
        return Tracker.findByPk(trackerId, {
            include: [
                {
                    model: Redirect,
                    as: 'redirect',
                },
                {
                    model: Team,
                    as: 'team',
                    include: [
                        {
                            model: User,
                            as: 'users'
                        }, {
                            model: User,
                            as: 'owner'
                        }
                    ]
                }
            ]
        });

    }

    static async getTrackerData(trackerId: string, user: User) {
        logger.trace(`TrackerService.getTrackerData [${trackerId}] [${user.id}]`);
        const tracker = await this.getFullTracker(trackerId);
        if (!tracker) {
            throw new Error("Tracker not found");
        }

        if (TrackerService.checkTrackerOwnership(tracker, user)) {
            return tracker;
        };

        throw new Error("User or team is not authorized to view this tracker");
    }

    static async updateTracker(tracker: Tracker, name: string, description?: string) {

        logger.trace(`TrackerService.updateTracker [TID: ${tracker.id}] [NEW_NAME: ${name}] [NEW_DESC: ${description}]`);
        logger.info(`Updating tracker ${tracker.id} with name ${tracker.name} -> ${name} and description ${tracker.description} -> ${description}`);

        const newdesc = description || "";
        return tracker.update({ name, description: newdesc });
    }

    static deleteTracker(tracker: Tracker) {
        logger.trace(`TrackerService.deleteTracker [${tracker.id}]`);
        return tracker.destroy();
    }

}