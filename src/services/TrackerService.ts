import logger from "../config/logger";
import Redirect from "../models/Redirect";
import Team from "../models/Team";
import Tracker from "../models/Tracker";
import User from "../models/User";
import { TeamService } from "./TeamService";

export class TrackerService {

    static async createForRedirect(redirect: Redirect) {
        const name = redirect.keyword + " " + redirect.url;
        const tracker = await Tracker.create({ name, redirectId: redirect.id });

        return tracker;
    }

    static getTrackersForTeam(team: Team) {
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
        if (TeamService.userHasPermissionsOnTeam(user, tracker.team)) {
            return true;
        }
    }

    private static getFullTracker(trackerId: string) {
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
        logger.info(`Updating tracker ${tracker.id} with name ${tracker.name} -> ${name} and description ${tracker.description} -> ${description}`);
        const newdesc = description || "";
        return tracker.update({ name, description: newdesc });
    }

    static deleteTracker(tracker: Tracker) {
        return tracker.destroy();
    }

}