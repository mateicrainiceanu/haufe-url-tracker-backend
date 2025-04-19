import Team from "../models/Team";
import User from "../models/User";
import UserService from "../services/UserServices";

export default class TeamsController {
    static async createTeam(user: User, teamName?:string) {
        const team = await Team.create({ ownerId: user.id, name: teamName ? teamName : UserService.getUsername(user) + "'s Team" });
        user.addTeam(team);
    }

    static getTeams(user: User) {
        const teams = user.getTeams();
        return teams;
    }

}