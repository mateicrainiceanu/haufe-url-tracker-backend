import logger from "../config/logger";
import Redirect from "./Redirect";
import Team from "./Team";
import Tracker from "./Tracker";
import User from "./User";

export const initAssociations = () => {
    User.belongsToMany(Team, { through: "UserTeam", as: "teams" });
    Team.belongsToMany(User, { through: "UserTeam", as: "users" });
    Team.belongsTo(User, { foreignKey: "ownerId", as: "owner" });

    Tracker.belongsTo(Redirect, { foreignKey: "redirectId", as: "redirect" });

    Team.belongsToMany(Tracker, { through: "TeamTrackers", as: "trackers" });
    Tracker.belongsToMany(Team, { through: "TeamTrackers", as: "teams" });

    logger.info("Associations were created");
}