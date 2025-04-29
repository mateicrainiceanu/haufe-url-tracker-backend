import logger from "../config/logger";
import AccessLog from "../models/AccessLog";
import Tracker from "../models/Tracker";

export interface LogData {
    ip: string;
    language: string;
    browser: string;
    deviceModel: string;
    deviceVendor: string;
    deviceOs: string;
    country: string;
    city: string;
    region: string;
    timezone: string;
}

class AccessLogService {
    static async logAccess(tracker: Tracker, data: LogData) {
        logger.trace("AccessLogService.logAccess");

        if (!tracker?.id) {
            throw new Error("Tracker is invalid or missing ID");
        }

        try {
            return await AccessLog.create({
                trackerId: tracker.id,
                ...data
            });
        } catch (error) {
            throw new Error(`Failed to create access log for tracker ${tracker.id}: ${error.message}`);
        }
    }

    static getLogsForTracker(tracker: Tracker) {
        return tracker.getAccessLogs({});
    } 
}

export default AccessLogService;
