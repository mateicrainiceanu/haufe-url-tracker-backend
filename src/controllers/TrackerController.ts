import Team from "../models/Team";
import { TrackerService } from "../services/TrackerService";

export default class TrackerController { 
    static async getForTeam(team: Team) {
        return await TrackerService.getTrackersForTeam(team);
    }
}