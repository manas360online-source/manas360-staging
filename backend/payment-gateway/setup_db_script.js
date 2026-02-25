
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const adminConfig = {
    user: 'postgres',
    host: 'localhost',
    database: 'postgres', // Connect to default DB first
    password: 'admin',
    port: 5432,
};

const dbName = 'manas360';

async function setupDatabase() {
    // 1. Create Database if not exists
    const adminClient = new Client(adminConfig);
    try {
        await adminClient.connect();
        const res = await adminClient.query(`SELECT 1 FROM pg_database WHERE datname = '${dbName}'`);
        if (res.rowCount === 0) {
            console.log(`Database '${dbName}' does not exist. Creating...`);
            await adminClient.query(`CREATE DATABASE "${dbName}"`);
            console.log(`Database '${dbName}' created successfully.`);
        } else {
            console.log(`Database '${dbName}' already exists.`);
        }
    } catch (e) {
        console.error("Error checking/creating database:", e.message);
        process.exit(1);
    } finally {
        await adminClient.end();
    }

    // 2. Run Schema
    const appClient = new Client({
        ...adminConfig,
        database: dbName
    });

    try {
        await appClient.connect();
        const schemaPath = path.join(__dirname, 'database', 'schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        console.log("Running schema...");
        await appClient.query(schemaSql);
        console.log("Schema applied successfully!");

    } catch (e) {
        console.error("Error executing schema:", e.message);
    } finally {
        await appClient.end();
    }
}

setupDatabase();
