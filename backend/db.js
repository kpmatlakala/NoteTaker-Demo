const sql = require('mssql');

// Azure SQL connection config
const config = {
    user: 'notetakeradmin',          // e.g., adminuser
    password: 'AdminP@ss',      // the password you set
    server: 'notetakersqlsrv.database.windows.net', // e.g., notetakersqlsrv.database.windows.net
    database: 'NoteTakerDB',           // your database name
    options: {
        encrypt: true,                 // mandatory for Azure
        trustServerCertificate: false  // set to true only for local dev
    }
};

async function connectToDb() {
    try {
        await sql.connect(config);
        console.log('Connected to Azure SQL Database!');
    } catch (err) {
        console.error('Database connection failed:', err);
    }
}

module.exports = { sql, connectToDb };
