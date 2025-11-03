const sql = require('mssql');
const { getPool } = require('../db');

const Column = {
  // Get all columns for a board
  async getAll(boardId) {
    const pool = await getPool();
    const result = await pool.request()
      .input('BoardId', sql.Int, boardId)
      .query('SELECT * FROM Columns WHERE BoardId = @BoardId ORDER BY Position');
    return result.recordset;
  },

  // Get single column
  async getById(columnId) {
    const pool = await getPool();
    const result = await pool.request()
      .input('ColumnId', sql.Int, columnId)
      .query('SELECT * FROM Columns WHERE ColumnId = @ColumnId');
    return result.recordset[0];
  },

  // Create new column
  async create(boardId, title, position = 0) {
    const pool = await getPool();
    const result = await pool.request()
      .input('BoardId', sql.Int, boardId)
      .input('Title', sql.NVarChar, title)
      .input('Position', sql.Int, position)
      .query(`
        INSERT INTO Columns (BoardId, Title, Position)
        OUTPUT INSERTED.*
        VALUES (@BoardId, @Title, @Position)
      `);
    return result.recordset[0];
  },

  // Update column
  async update(columnId, title, position) {
    const pool = await getPool();
    await pool.request()
      .input('ColumnId', sql.Int, columnId)
      .input('Title', sql.NVarChar, title)
      .input('Position', sql.Int, position)
      .query('UPDATE Columns SET Title = @Title, Position = @Position WHERE ColumnId = @ColumnId');
    
    return this.getById(columnId);
  },

  // Delete column
  async delete(columnId) {
    const pool = await getPool();
    await pool.request()
      .input('ColumnId', sql.Int, columnId)
      .query('DELETE FROM Columns WHERE ColumnId = @ColumnId');
    return true;
  }
};

module.exports = Column;
