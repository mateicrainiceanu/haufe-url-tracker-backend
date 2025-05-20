import Team from "../models/Team";
import DevKeyService from "../services/DevKeyService";
import logger from "../config/logger";
import User from "../models/User";
import {TeamService} from "../services/TeamService";

export default class DevKeysController {
    static generateDevKey(team: Team) {
        logger.debug(`DevKeysController.generateDevKey team_id [${team.id}]`);
        return DevKeyService.createDevKey(team);
    }

    static async deleteDevKey(keyId: string, user: User) {
        logger.debug(`DevKeysController.deleteDevKey key_id [${keyId}] user_id [${user.id}]`);
        const devKey = await DevKeyService.getById(keyId);

        if (TeamService.userHasPermissionsOnTeam(user, devKey.team)) {
            await DevKeyService.deleteDevKey(devKey);
            return;
        }

        logger.info(`Deleting dev key [${devKey.id}]`);
    }

    static async getTeamForKey(keyId: string) {
        logger.debug(`DevKeysController.getTeamForKey key_id [${keyId}]`);
        const devKey = await DevKeyService.getById(keyId);

        return devKey.team;
    }
}