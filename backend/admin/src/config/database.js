// ================================================
// MANAS360 Session Analytics - Database Configuration
// Story 3.6: Session Analytics
// ================================================

const { Sequelize } = require('sequelize');

const dbHost = process.env.DB_HOST ?? 'localhost';
const dbPort = Number(process.env.DB_PORT ?? 5432);
const dbName = process.env.DB_NAME ?? 'manas360';
const dbUser = process.env.DB_USER ?? process.env.PGUSER ?? process.env.USER ?? 'postgres';
const dbPass = process.env.DB_PASS ?? process.env.PGPASSWORD ?? '';
const databaseUrl = process.env.DATABASE_URL;

console.log('Database Config:', {
    host: dbHost,
    port: dbPort,
    database: dbName,
    user: dbUser,
    has_database_url: Boolean(databaseUrl),
    password_length: dbPass.length
});

const sequelizeOptions = {
    host: dbHost,
    port: dbPort,
    dialect: 'postgres',
    logging: console.log,
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    define: {
        timestamps: true,
        underscored: true,
        freezeTableName: true
    }
};

const sequelize = (databaseUrl && !process.env.DB_NAME && !process.env.DB_USER)
    ? new Sequelize(databaseUrl, sequelizeOptions)
    : new Sequelize(dbName, dbUser, dbPass, sequelizeOptions);

const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connection established successfully.');
    } catch (error) {
        console.error('❌ Unable to connect to database:', error.message);
    }
};

module.exports = { sequelize, testConnection };
