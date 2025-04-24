import Team from "../models/Team";
import User from "../models/User";
import { TrackerService } from "../services/TrackerService";

export default class TrackerController { 
    static async getForTeam(team: Team) {
        return await TrackerService.getTrackersForTeam(team);
    }

    static async updateTracker(trackerId: string, user: User, team: Team, name: string, description?: string) {
        const newdesc = description || "";

        if (!name) {
            throw new Error("A name is required");
        }
        
        const tracker = await TrackerService.getTrackerData(trackerId, team, user);
        
        return TrackerService.updateTracker(tracker, name, newdesc);
    }
}