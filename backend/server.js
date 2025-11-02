
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { connectToDb } = require('./db');

const boardRoutes = require('./routes/boards');
const cardRoutes = require('./routes/cards');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from frontend directory
app.use(express.static(path.join(__dirname, '../')));


// Connect to Azure SQL
connectToDb();

app.get('/test-db', async (req, res) => {
    try {
        const result = await require('./db').sql.query('SELECT 1 AS number');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// API Routes
app.use('/api/boards', boardRoutes);
app.use('/api/boards/:boardId/cards', cardRoutes);

// Root route - serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📋 Frontend: http://localhost:${PORT}`);
  console.log(`🔌 API: http://localhost:${PORT}/api`);
});

module.exports = app;