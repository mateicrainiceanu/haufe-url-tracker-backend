import Team from "../models/Team";
import DevKeyService from "../services/DevKeyService";

export default class DevKeysController {
    static async generateDevKey(team: Team) {
        const devKey = await DevKeyService.createDevKey(team);
        return devKey;
    }

    static async deleteDevKey(keyId: string) {

    }
}