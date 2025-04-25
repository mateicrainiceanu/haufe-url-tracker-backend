import { DataTypes, Model } from "sequelize";
import db from "../config/db";
import Tracker from "./Tracker";

class AccessLog extends Model {
    id: string;
    trackerId: string;

    ip: string;
    language: string;
    browser: string;
    deviceModel: string;
    deviceVendor: string;
    deviceOs: string;
    country: string;
    city: string;
    region: string;
    timezone: string;

    createdAt: Date;
    updatedAt: Date;
}

AccessLog.init(
    {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
        trackerId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "Trackers",
                key: "id",
            },
            onDelete: "CASCADE",
        },
        ip: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        language: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        browser: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        deviceModel: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        deviceVendor: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        deviceOs: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        country: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        region: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        timezone: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize: db,
        modelName: "AccessLog",
    }
);

export default AccessLog;
