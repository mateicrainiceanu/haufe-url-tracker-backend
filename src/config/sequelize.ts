import { Sequelize } from "sequelize"

const sequelize = new Sequelize('postgres://mateicrainiceanu:postgres@localhost:5432/url-tracker');

testSequelize();
async function testSequelize() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }

}

export {testSequelize};
export default sequelize;