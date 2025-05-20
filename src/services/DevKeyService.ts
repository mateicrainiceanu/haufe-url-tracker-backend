import Team from "../models/Team";
import DevKey from "../models/DevKey";
import logger from "../config/logger";
import User from "../models/User";
import CustomError from "../utils/CustomError";

export default class DevKeyService {
    static createDevKey(team: Team) {
        logger.trace(`DevKeyService.createDevKey Creating dev key for team ${team.id}`);
        return DevKey.create({teamId: team.id})
    }

    static async getById(keyId: string) {
        logger.trace(`DevKeyService.getById [${keyId}]`);
        const key = await DevKey.findByPk(keyId, {
            include: [
                {
                    model: Team,
                    as: 'team',
                    include: [
                        {
                            model: User,
                            as: 'users',
                            attributes: ["email", "id"]
                        }
                    ]
                }
            ]
        });

        if (!key) {
            throw new CustomError(404, "Dev key not found");
        }

        return key;
    }

    static async deleteDevKey(key: DevKey) {
        logger.trace(`DevKeyService.deleteDevKey [${key.id}]`);
        return key.destroy();
    }
}