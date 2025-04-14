import {Sequelize, DataTypes} from "sequelize";
import sequelize from "../config/sequelize";

const User = sequelize.define(
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
    }
)

export default User;