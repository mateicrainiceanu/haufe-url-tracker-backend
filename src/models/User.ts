import { DataTypes, Model } from "sequelize";
import db from "../config/db";

class User extends Model {
    id: number;
    email: string;
    hash: string;
}

User.init(
    {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        hash: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },
    {
        sequelize: db, 
        modelName: 'User',
        timestamps: true,
    }, 
)

export default User;