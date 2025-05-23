import logger from "../config/logger";
import AccessLog from "./AccessLog";
import Redirect from "./Redirect";
import Team from "./Team";
import Tracker from "./Tracker";
import User from "./User";
import DevKey from "./DevKey";

export const initAssociations = () => {
    User.belongsToMany(Team, {through: "UserTeam", as: "teams"});
    Team.belongsToMany(User, {through: "UserTeam", as: "users"});
    Team.belongsTo(User, {foreignKey: "ownerId", as: "owner"});

    Tracker.belongsTo(Redirect, {foreignKey: "redirectId", as: "redirect"});
    Redirect.hasOne(Tracker, {foreignKey: 'redirectId', as: 'tracker'});

    Team.hasMany(Tracker, {foreignKey: "teamId", as: "trackers"});
    Tracker.belongsTo(Team, {foreignKey: "teamId", as: "team"});

    AccessLog.belongsTo(Tracker, {
        foreignKey: "trackerId",
        as: "tracker",
    });
    Tracker.hasMany(AccessLog, {
        foreignKey: "trackerId",
        as: "accessLogs",
    });

    Team.hasMany(DevKey, {
        foreignKey: "teamId",
        as: "devKeys"
    })

    DevKey.belongsTo(Team, {
        foreignKey: "teamId",
        as: "team"
    })

    logger.info("Associations were created");
}