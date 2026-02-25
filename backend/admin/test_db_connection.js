const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    'manas360',
    'postgres',
    'password123',
    {
        host: 'localhost',
        port: 5434,
        dialect: 'postgres',
        logging: console.log
    }
);

(async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Connection has been established successfully.');
    } catch (error) {
        console.error('❌ Unable to connect to the database:', error);
    } finally {
        await sequelize.close();
    }
})();
