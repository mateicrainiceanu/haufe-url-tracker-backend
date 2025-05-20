import Team from "../models/Team";
import DevKeyService from "../services/DevKeyService";
import logger from "../config/logger";
import User from "../models/User";
import {TeamService} from "../services/TeamService";

export default class DevKeysController {
    static generateDevKey(team: Team) {
        return DevKeyService.createDevKey(team);
    }

    static async deleteDevKey(keyId: string, user: User) {
        const devKey = await DevKeyService.getById(keyId);

        if (TeamService.userHasPermissionsOnTeam(user, devKey.team)) {
            await DevKeyService.deleteDevKey(devKey);
            return;
        }

        logger.info(`Deleting dev key [${devKey.id}]`);
    }
}