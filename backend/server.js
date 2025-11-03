const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const { connectToDb, getPool } = require("./db");

const boardRoutes = require("./routes/boards");
const cardRoutes = require("./routes/cards");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from frontend directory
app.use(express.static(path.join(__dirname, "../")));

// Connect to Azure SQL
connectToDb();

// API routes first
app.use("/api/boards", boardRoutes);
app.use("/api/boards/:boardId/cards", cardRoutes);

// Root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../index.html"), (err) => {
    if (err) {
      console.error("❌ Failed to send index.html:", err);
      res.status(500).send("Frontend file not found.");
    }
  });
});

app.get('/api/health', async (req, res) => {
  let dbStatus = 'not connected';
  try {
    const pool = getPool();
    // Test a simple query to ensure DB is reachable
    await pool.request().query('SELECT 1 AS number');
    dbStatus = 'connected';
  } catch (err) {
    dbStatus = `error: ${err.message}`;
  }

  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    db: dbStatus
  });
});


app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
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
connectToDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📋 Frontend: http://localhost:${PORT}`);
      console.log(`🔌 API: http://localhost:${PORT}/api`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server, DB not connected:", err);
  });

module.exports = app;
