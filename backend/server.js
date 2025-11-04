const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const { connectToDb, getPool } = require("./db");

const boardRoutes = require("./routes/boardRoutes");
const cardRoutes = require("./routes/cardRoutes");
const columnsRoutes = require('./routes/columnRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Serve frontend
const FRONTEND_DIR = path.join(__dirname, "frontend"); 
app.use(express.static(FRONTEND_DIR));

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// API routes
// Boards
app.use('/api/boards', boardRoutes);
// Columns
app.use('/api/columns', columnsRoutes);
// Cards
app.use('/api/cards', cardRoutes);

// Serve index.html only for routes that don't match /api/*
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, "index.html"));
});

app.get("/", (req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, "index.html"), (err) => {
    if (err) {
      console.error("❌ Failed to send index.html:", err);
      res.status(500).send("Frontend file not found.");
    }
  });
});

// Health endpoint
app.get("/api/health", async (req, res) => {
  let dbStatus = "not connected";
  try {
    const pool = getPool();
    await pool.request().query("SELECT 1 AS number");
    dbStatus = "connected";
  } catch (err) {
    dbStatus = `error: ${err.message}`;
  }

  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    db: dbStatus,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start server
async function startServer() {
  try {
    await connectToDb();
    console.log("✅ Connected to Azure SQL Database");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📋 Frontend: http://localhost:${PORT}`);
      console.log(`🔌 API: http://localhost:${PORT}/api`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
}

startServer();

module.exports = app;
