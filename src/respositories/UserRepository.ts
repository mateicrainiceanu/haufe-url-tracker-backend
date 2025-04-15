import {DataTypes} from "sequelize";
import db from "../config/sequelize";

const UserRepository = db.define(
    'User',
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
        timestamps: true
    }
)

export default UserRepository;