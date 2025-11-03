const sql = require('mssql');
require('dotenv').config();

let pool;

// Azure SQL connection config
const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: true,            // Required for Azure
    trustServerCertificate: false
  }
};

// Connect to Azure SQL and initialize the pool
async function connectToDb() {
  try {
    pool = await sql.connect(config);
    console.log('✅ Connected to Azure SQL Database!');
    return pool;
  } catch (err) {
    console.error('❌ Database connection failed:', err);
    throw err; // propagate error so server can handle it
  }
}

// getter for the pool
function getPool() {
  if (!pool) throw new Error('Database not connected yet.');
  return pool;
}

module.exports = { sql, getPool, connectToDb };
