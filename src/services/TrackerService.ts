import Redirect from "../models/Redirect";
import Tracker from "../models/Tracker";

export class TrackerService {
    static async createForRedirect(redirect: Redirect) {
        const name = redirect.keyword + " " + redirect.url;
        const tracker = await Tracker.create({name, redirectId: redirect.id});

        return tracker;
    }
}