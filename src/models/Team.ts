import { DataTypes, Model } from "sequelize";
import db from "../config/db";
import User from "./User";

class Team extends Model {
    id: string;
    ownerId: string;
    name: string;
}

Team.init({
    id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    }
},
    {
        sequelize: db,
        modelName: "Team"
    })



export default Team;