const { getPool } = require('../db');

// Get all boards
async function getAllBoards() {
  const pool = await getPool();
  const result = await pool.request().query('SELECT * FROM Boards');
  return result.recordset;
}

// Get board by ID
async function getBoardById(boardId) {
  const pool = await getPool();
  const result = await pool.request()
    .input('BoardId', boardId)
    .query('SELECT * FROM Boards WHERE BoardId = @BoardId'); // <- use BoardId
  return result.recordset[0];
}

// Create new board
async function createBoard({ title }) {
  const pool = await getPool();
  const result = await pool.request()
    .input('Title', title) // your Boards table column is Title
    .query('INSERT INTO Boards (Title) VALUES (@Title); SELECT SCOPE_IDENTITY() AS BoardId;');
  return { BoardId: result.recordset[0].BoardId, Title: title };
}

// Delete board
async function deleteBoard(boardId) {
  const pool = await getPool();
  const result = await pool.request()
    .input('BoardId', boardId)
    .query('DELETE FROM Boards WHERE BoardId = @BoardId; SELECT @@ROWCOUNT AS affected;');
  return result.recordset[0].affected > 0;
}

module.exports = { getAllBoards, getBoardById, createBoard, deleteBoard };
