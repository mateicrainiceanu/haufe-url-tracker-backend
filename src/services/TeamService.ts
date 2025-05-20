import logger from "../config/logger";
import Team from "../models/Team";
import Tracker from "../models/Tracker";
import User from "../models/User";
import CustomError from "../utils/CustomError";
import UserService from "./UserServices";
import DevKey from "../models/DevKey";

export class TeamService {
    static async createTeam(user: User, teamName?: string) {
        const name = teamName ? teamName : UserService.getUsername(user) + "'s Team"
        logger.trace("TeamService.createTeam " + teamName);

        const team = await Team.create({ownerId: user.id, name})
        await team.addUser(user);
        logger.info(`Team [${team.id}] created by user [${user.id}]`);
        return team;
    }

    static getFullForUser(user: User) {
        logger.trace(`TeamService.getFullForUser [${user.id}]`);
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
                },
                {
                    model: DevKey,
                    as: "devKeys",
                }
            ]
        })
    }

    static userHasPermissionsOnTeam(user: User, team: Team) {
        logger.trace(`TeamService.userHasPermissionsOnTeam [${user.id}] [${team.id}]`);
        return team.users.findIndex(teamUser => teamUser.id === user.id) !== -1
    }

    static isUserOwnerOfTeam(user: User, team: Team) {
        logger.trace(`TeamService.isUserOwnerOfTeam [${user.id}] [${team.id}]`);
        return team.ownerId === user.id;
    }

    static async getFullTeam(teamId: string) {
        logger.trace(`TeamService.getFullTeam [${teamId}]`);
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
                },
                {
                    model: DevKey,
                    as: "devKeys",
                }
            ]
        });

        if (!team) {
            logger.error(`TeamService.getFullTeam [${teamId}] - Team not found`);
            throw new CustomError(404, "Team not found");
        }

        return team;
    }

    static async updateTeamName(user: User, team: Team, name: string) {
        logger.trace(`TeamService.updateTeamName [UID: ${user.id}] [TID: ${team.id}] [NEW_NAME: ${name}]`);
        if (!this.userHasPermissionsOnTeam(user, team)) {
            logger.error(`TeamService.updateTeamName [${user.id}] [${team.id}] - User does not have permissions on team`);
            throw new CustomError(401, "User does not have permissions on team");
        }

        team.name = name;
        await team.save();
    }

    static deleteTeam(team) {
        logger.trace(`TeamService.deleteTeam [${team.id}]`);
        return team.destroy();
    }

    static addUserToTeam(user: User, team: Team) {
        logger.trace(`TeamService.addUserToTeam [UID: ${user.id}] [TID: ${team.id}]`);
        return user.addTeam(team)
    }

    static removeUserFromTeam(user: User, team: Team) {
        logger.trace(`TeamService.removeUserFromTeam [UID: ${user.id}] [TID: ${team.id}]`);
        return team.removeUser(user);
    }

    static addTrackerToTeam(team: Team, tracker: Tracker) {
        logger.trace(`TeamService.addTrackerToTeam [TID: ${team.id}] [TRACKERID: ${tracker.id}]`);
        return team.addTracker(tracker);
    }

}