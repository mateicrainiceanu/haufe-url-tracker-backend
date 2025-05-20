import logger from "../config/logger";
import User from "../models/User";
import RedirectService from "../services/RedirectService";
import {TeamService} from "../services/TeamService";
import {TrackerService} from "../services/TrackerService";
import CustomError from "../utils/CustomError";
import TeamsController from "./TeamsController";

export default class RedirectController {

    static async findByKw(keyword: string) {
        const redirect = await RedirectService.getRedirectByKeyword(keyword);
        if (!redirect) {
            logger.error(`Redirect with keyword [${keyword}] not found`);
            throw new CustomError(404, "Redirect not found");
        }
        return redirect;
    }

    static async createRedirect(
        dest: string,
        keyword?: string,
        teamId?: string,
        user?: User,
        name?: string,
        description?: string
    ) {
        const kw = keyword || RedirectService.generateKeyword();
        if (!dest) {
            throw new CustomError(400, "Destination URL is requrired");
        }
        if (!user) {
            return await RedirectService.createKeywordRedirect(dest, kw);
        }
        if (teamId && user) {
            const team = await TeamsController.getFullTeamForUser(teamId, user);

            if (!team) {
                logger.error(`Team with ID [${teamId}] not found`);
                throw new CustomError(404, "Team was not found");
            }

            const redirect = await RedirectService.createKeywordRedirect(dest, kw);

            if (!redirect) {
                logger.error(`Failed to create redirect. Destination: ${dest}, Keyword: ${kw}, Team ID: ${teamId}, User ID: ${user.id}`);
                throw new CustomError(500, "Failed to create redirect");
            }

            const tracker = await TrackerService.createForRedirect(redirect, name, description);

            await TeamService.addTrackerToTeam(team, tracker);

            return {
                redirect: {...redirect.get({plain: true}), tracker},
                tracker: {...tracker.get({plain: true}), redirect}
            };
        }
    }
}