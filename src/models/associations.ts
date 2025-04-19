import logger from "../config/logger";
import Team from "./Team";
import User from "./User";

export const initAssociations = () => {
    User.belongsToMany(Team, { through: "UserTeam" });
    Team.belongsToMany(User, { through: "UserTeam" });
    Team.belongsTo(User, { foreignKey: "ownerId", as: "owner" });

    logger.info("Associations were created");
}