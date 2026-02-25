
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const config = {
    user: 'postgres',
    host: 'localhost',
    database: 'manas360',
    password: 'admin',
    port: 5432,
};

async function insertDummyData() {
    const client = new Client(config);
    try {
        await client.connect();

        const dummyPath = path.join(__dirname, 'database', 'dummy_data.sql');
        const sql = fs.readFileSync(dummyPath, 'utf8');

        console.log("Inserting Dummy Data into 'manas360'...");
        await client.query(sql);
        console.log("Data inserted successfully! ✅");

    } catch (e) {
        if (e.code === '23505') {
            console.log("Dummy data mostly exists (Duplicate Key Error). Keeping existing data. ✅");
        } else {
            console.error("Error inserting data:", e.message);
        }
    } finally {
        await client.end();
    }
}

insertDummyData();
