import logger from "../config/logger";
import Team from "../models/Team";
import User from "../models/User";
import UserService from "./UserServices";

export class TeamService {
    static async createTeam(user: User, teamName?: string) {
        const team = await Team.create({ ownerId: user.id, name: teamName ? teamName : UserService.getUsername(user) + "'s Team" })
        await team.addUser(user);
        logger.info(`Team [${team.id}] created by user [${user.id}]`);
        return team;
    }

    static getFullForUser(user: User) {
        return user.getTeams({
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
        })
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

    static async updateTeamName(user: User, team: Team, name: string) {
        team.name = name;
        await team.save();
    }

    static deleteTeam(team) {
        return team.destroy();
    }

    static addUserToTeam(user: User, team: Team) {
        return user.addTeam(team)

    }

    static removeUserFromTeam(user: User, team: Team) {
        return team.removeUser(user);
    }

}