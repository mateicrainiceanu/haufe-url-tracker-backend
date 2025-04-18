import { Sequelize } from "sequelize"

require("dotenv").config();

const connectionUrl = process.env.POSTGRES_DB
const db = new Sequelize(connectionUrl, { dialect: 'postgres', logging: false });

testSequelize();

async function testSequelize() {
    try {
        await db.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }

}

export { testSequelize };
export default db;