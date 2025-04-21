import logger from "../config/logger";
import Team from "../models/Team";
import User from "../models/User";
import { TeamService } from "../services/TeamService";

export default class TeamsController {
    static async createTeam(user: User, teamName?: string) {
        const team = await TeamService.createTeam(user, teamName);

        return team;
    }

    static getTeams(user: User) {
        return TeamService.getFullForUser(user);
    }

    static async getFullTeamForUser(teamId: string, user: User) {

        const team = await TeamService.getFullTeam(teamId);

        if (!TeamService.userHasPermissionsOnTeam(user, team)) {
            logger.warn(`User [${user.id}] tried to access team [${teamId}]`);
            throw new Error("User has no access to this team");
        }

        return team;
    }

    static async updateTeam(teamId: string, user: User, name: string) {
        const team = await this.getFullTeamForUser(teamId, user);

        if (name) {
            TeamService.updateTeamName(user, team, name);
            logger.info(`Team [${teamId}] updated`);
        }

        return team;
    }

    static async deleteTeam(teamId: string, user: User) {
        const team = await TeamService.getFullTeam(teamId);

        if (!TeamService.isUserOwnerOfTeam(user, team)) {
            throw new Error("Only owners can delete teams");
        }

        TeamService.deleteTeam(team);

        logger.info(`Team [${teamId}] deleted by owner [${user.id}]`);
    }

}