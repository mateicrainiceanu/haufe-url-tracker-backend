import { DataTypes, Model } from "sequelize";
import db from "../config/db";
import Team from "./Team";

class User extends Model {
    static getTeams(arg0: { include: { model: typeof User; as: string; attributes: string[]; }[]; }) {
        throw new Error("Method not implemented.");
    }
    id: string;
    email: string;
    hash: string;

    addTeam!: (team: Team) => Promise<void>;
    getTeams!: (prop: object) => Promise<Team[]>;
    hasTeam!: (team: Team) => Promise<boolean>;
}

User.init(
    {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
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