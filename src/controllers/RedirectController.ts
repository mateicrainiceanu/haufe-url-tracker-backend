import User from "../models/User";
import RedirectService from "../services/RedirectService";

export default class RedirectController {
    static async createRedirect(dest: string, keyword?: string, teamId?: string, user?: User) {
        if (!dest) {
            throw new Error("Destination URL is required");
        }
        if(!keyword && !user) {
            return RedirectService.createSimpleRedirect(dest);
        }
        if (keyword && !user) {
            return RedirectService.createKeywordRedirect(dest, keyword);
        }
        if (teamId && user) {
            // Implement trackers
        }
    }
}