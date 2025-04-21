import logger from "../config/logger";
import Team from "./Team";
import User from "./User";

export const initAssociations = () => {
    User.belongsToMany(Team, { through: "UserTeam", as: "teams" });
    Team.belongsToMany(User, { through: "UserTeam", as: "users" });
    Team.belongsTo(User, { foreignKey: "ownerId", as: "owner" });

    logger.info("Associations were created");
}