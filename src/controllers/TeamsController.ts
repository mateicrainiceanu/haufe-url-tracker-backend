import logger from "../config/logger";
import Team from "../models/Team";
import User from "../models/User";
import { TeamService } from "../services/TeamService";
import UserService from "../services/UserServices";
import CustomError from "../utils/CustomError";

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
            throw new CustomError(401, "User has no access to this team");
        }

        return team;
    }

    static async updateTeam(teamId: string, user: User, name: string) {
        const team = await this.getFullTeamForUser(teamId, user);

        if (name) {
            await TeamService.updateTeamName(user, team, name);
            logger.info(`Team [${teamId}] updated`);
        }

        return team;
    }

    static async deleteTeam(teamId: string, user: User) {
        const team = await TeamService.getFullTeam(teamId);

        if (!TeamService.isUserOwnerOfTeam(user, team)) {
            throw new CustomError(401, "Only owners can delete teams");
        }

        TeamService.deleteTeam(team);

        logger.info(`Team [${teamId}] deleted by owner [${user.id}]`);
    }

    static async addUserToTeam(user: User, teamId: string, userId: string) {
        const team = await TeamService.getFullTeam(teamId);

        if (!TeamService.isUserOwnerOfTeam(user, team)) {
            throw new CustomError(401, "Only owners can add users to teams");
        }

        const userToAdd = await User.findByPk(userId);

        if (!userToAdd) {
            throw new CustomError(404, "User not found");
        }

        if (TeamService.userHasPermissionsOnTeam(userToAdd, team)) {
            throw new CustomError(404, "User already has access to this team");
        }

        await TeamService.addUserToTeam(userToAdd, team);

        logger.info(`User [${user.id}] added user [${userToAdd.id}] to team [${teamId}]`);

        return team;
    }

    static async removeUserFromTeam(user: User, teamId: string, userId: string) {
        const team = await TeamService.getFullTeam(teamId);

        if (!TeamService.isUserOwnerOfTeam(user, team)) {
            throw new Error("Only owners can remove users from teams");
        }

        const userToRemove = await User.findByPk(userId);

        if (!userToRemove) {
            throw new CustomError(404, "User not found");
        }

        if (!TeamService.userHasPermissionsOnTeam(userToRemove, team)) {
            throw new CustomError(401, "User does not have access to this team");
        }

        await TeamService.removeUserFromTeam(userToRemove, team);

        logger.info(`User [${user.id}] removed user [${userToRemove.id}] from team [${teamId}]`);

        return TeamService.getFullTeam(teamId);
    }

}