import Redirect from "../models/Redirect";
import Team from "../models/Team";
import Tracker from "../models/Tracker";

export class TrackerService {
    static async createForRedirect(redirect: Redirect) {
        const name = redirect.keyword + " " + redirect.url;
        const tracker = await Tracker.create({name, redirectId: redirect.id});

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
}