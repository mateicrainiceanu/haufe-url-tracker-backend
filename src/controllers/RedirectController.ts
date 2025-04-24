import logger from "../config/logger";
import Tracker from "../models/Tracker";
import User from "../models/User";
import RedirectService from "../services/RedirectService";
import { TeamService } from "../services/TeamService";
import { TrackerService } from "../services/TrackerService";
import TeamsController from "./TeamsController";

export default class RedirectController {
    static async createRedirect(dest: string, keyword?: string, teamId?: string, user?: User) {
        const kw = keyword || RedirectService.generateKeyword();
        if (!dest) {
            throw new Error("Destination URL is required");
        }
        if (!user) {
            return { redirect: await RedirectService.createKeywordRedirect(dest, kw) };
        }
        if (teamId && user) {
            const team = await TeamsController.getFullTeamForUser(teamId, user);

            if (!team) {
                logger.error(`Team with ID [${teamId}] not found`);
                throw new Error("Team was not found");
            }

            const redirect = await RedirectService.createKeywordRedirect(dest, kw);

            if (!redirect) {
                logger.error(`Failed to create redirect. Destination: ${dest}, Keyword: ${kw}, Team ID: ${teamId}, User ID: ${user.id}`);
                throw new Error("Failed to create redirect");
            }

            const tracker = await TrackerService.createForRedirect(redirect);

            await TeamService.addTrackerToTeam(team, tracker);

            return { redirect: { ...redirect.get({ plain: true }), tracker }, tracker: { ...tracker.get({ plain: true }), redirect } };
        }
    }
}