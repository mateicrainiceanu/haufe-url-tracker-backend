import { DataTypes, Model } from "sequelize";
import db from "../config/db";
import Team from "./Team";
import Redirect from "./Redirect";

class Tracker extends Model {
    id: string;
    name: string;
    description: string;
    team: Team;
    redirect: Redirect;
}

Tracker.init({
    id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    }
},
    {
        sequelize: db,
        modelName: "Tracker"
    }
);

export default Tracker;