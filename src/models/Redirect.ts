import { DataTypes, Model } from "sequelize";
import db from "../config/db";

class Redirect extends Model {
    id: string;
    keyword: string;
    url: string;
}

Redirect.init({
    id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    keyword: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    sequelize: db,
    modelName: 'Redirect',
    timestamps: true,
});

export default Redirect;