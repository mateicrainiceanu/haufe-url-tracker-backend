import logger from "../config/logger";
import Tracker from "../models/Tracker";
import {Request} from "express";
import geoip from "geoip-lite";
import * as UAParserJS from "ua-parser-js"
import AccessLogService from "../services/AccessLogService";
import User from "../models/User";
import {TrackerService} from "../services/TrackerService";
import Team from "../models/Team";

export default class AccessController {

    static async newLog(tracker: Tracker, req: Request) {
        logger.debug(`AccessController.newLog [${tracker.id}]`);
        try {
            this.saveAccessLog(tracker, req);
        } catch (error) {
            logger.error(`Failed to save access log - ${error.message}`);
        }
    }

    static async getAccessData(trackerId: string, user: User) {
        logger.debug(`AccessController.getAccessData [${trackerId}] [${user.id}]`);

        if (!trackerId) {
            throw new Error("Tracker not found");
        }

        const tracker = await TrackerService.getTrackerData(trackerId, user);

        if (!tracker) {
            throw new Error("Tracker not found");
        }

        const accessLogs = await AccessLogService.getLogsForTracker(tracker);

        return {tracker, accessLogs};

    }

    static async getAccessDataDev(trackerId: string, apiTeam: Team) {
        logger.trace(`AccessController.getAccessDataDev [${trackerId}]`);

        const tracker = await TrackerService.getTrackerData(trackerId, apiTeam.owner);
        const accessLogs = await AccessLogService.getLogsForTracker(tracker);

        return {tracker, accessLogs};
    }

    private static async saveAccessLog(tracker: Tracker, req: Request) {
        logger.debug(`AccessController.saveAccessLog [${tracker.id}]`);
        const ua = req.headers["user-agent"];
        const ip = req.headers["x-forwarded-for"] || req.ip;
        const geo = geoip.lookup(ip);
        const language = req.headers["accept-language"] || "";

        const parser = new UAParserJS.UAParser(ua);
        const result = parser.getResult();

        const browser = result.browser.name || "unknown";
        const deviceModel = result.device.model || "unknown";
        const deviceVendor = result.device.vendor || "unknown"
        const deviceOs = result.os.name || "unknown";

        const emptyWord = ip.includes("192.168.") ? "local" : "unknown";

        const country = geo?.country || emptyWord;
        const city = geo?.city || emptyWord;
        const region = geo?.region || emptyWord;
        const timezone = geo?.timezone || emptyWord;

        const accessLog = await AccessLogService.logAccess(tracker, {
            ip: ip as string,
            language,
            browser,
            deviceModel,
            deviceVendor,
            deviceOs,
            country,
            city,
            region,
            timezone
        });

        logger.info(`Access log created for tracker [TRACKERID: ${tracker.id}] with id [LOGID: ${accessLog.id}]`);
    }
}