import logger from "../config/logger";
import Team from "../models/Team";
import User from "../models/User";
import UserService from "../services/UserServices";

export default class TeamsController {
    static async createTeam(user: User, teamName?: string) {
        const team = await Team.create({ ownerId: user.id, name: teamName ? teamName : UserService.getUsername(user) + "'s Team" });
        await team.addUser(user);

        logger.info(`Team ${team.id} created`);

        return team;
    }

    static getTeams(user: User) {
        const teams = user.getTeams();
        return teams;
    }

    static userHasPermissionsOnTeam(user: User, team: Team) {
        return team.users.findIndex(teamUser => teamUser.id === user.id) !== -1
    }

    static isUserOwnerOfTeam(user: User, team: Team) {
        return team.ownerId === user.id;
    }

    static async getFullTeam(teamId: string) {
        const team = await Team.findByPk(teamId, {
            include: [
                {
                    model: User,
                    as: "users",
                    attributes: ["id", "email"]
                },
                {
                    model: User,
                    as: "owner",
                    attributes: ["id", "email"]
                }
            ]
        });

        if (!team) {
            throw new Error("Team not found");
        }

        return team;
    }

    static async getFullTeamForUser(teamId: string, user: User) {

        const team = await this.getFullTeam(teamId);

        if (!this.userHasPermissionsOnTeam(user, team)) {
            throw new Error("User has no access to this team");
        }

        return team;
    }

    static async updateTeam(teamId: string, user: User, name: string) {
        const team = await this.getFullTeamForUser(teamId, user);

        if (name) {
            team.name = name;
            await team.save();
            logger.info(`Team [${teamId}] updated`);
        }

        return team;
    }

    static async deleteTeam(teamId: string, user: User) {
        const team = await this.getFullTeam(teamId);

        if (!this.isUserOwnerOfTeam(user, team)) {
            throw new Error("Only owners can delete teams");
        }

        await team.destroy();
        logger.info(`Team [${teamId}] deleted by owner [${user.id}]`);
    }

}