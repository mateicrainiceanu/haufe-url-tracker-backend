import {DataTypes, Model} from "sequelize";
import db from "../config/db";

class DevKey extends Model {
    id: string;
    teamId: string;

    getApiKey() {
        return this.id;
    }
}

DevKey.init({
    id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    teamId: {
        type: DataTypes.UUID,
        allowNull: false,
    }
}, {
    sequelize: db,
    modelName: 'DevKey',
    timestamps: true,
})

export default DevKey;


