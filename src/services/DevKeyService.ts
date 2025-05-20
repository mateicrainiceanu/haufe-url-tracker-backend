import Team from "../models/Team";
import DevKey from "../models/DevKey";
import logger from "../config/logger";

export default class DevKeyService {
    static createDevKey(team: Team) {
        logger.trace(`DevKeyService.createDevKey Creating dev key for team ${team.id}`);
        return DevKey.create({teamId: team.id})
    }

    static isKeyInTeam(keyId: string, team: Team) {
        return !!team.devKeys.find(key => key.id === keyId);
    }

    static deleteDevKey(keyId: string, team: Team) {

    }
}