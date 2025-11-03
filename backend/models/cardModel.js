const sql = require('mssql');
const { getPool } = require('../db');

// GET all cards
exports.getAllCards = async () => {
  const pool = await getPool();
  const result = await pool.request().query(
    `SELECT * FROM Cards ORDER BY ColumnId, CreatedAt ASC`
  );
  return result.recordset;
};

// GET cards by board
exports.getCardsByBoard = async (boardId) => {
  const pool = await getPool();
  const result = await pool.request()
    .input('BoardId', sql.Int, boardId)
    .query(`SELECT * FROM Cards WHERE BoardId = @BoardId ORDER BY ColumnId, CreatedAt ASC`);
  return result.recordset;
};

// GET card by ID
exports.getCardById = async (cardId) => {
  const pool = await getPool();
  const result = await pool.request()
    .input('CardId', sql.Int, cardId)
    .query('SELECT * FROM Cards WHERE CardId = @CardId');
  return result.recordset[0];
};

// CREATE card
exports.createCard = async (boardId, columnId, { title, description, priority }) => {
  const pool = await getPool();
  const result = await pool.request()
    .input('BoardId', sql.Int, boardId)
    .input('ColumnId', sql.Int, columnId)
    .input('Title', sql.NVarChar, title)
    .input('Description', sql.NVarChar, description)
    .input('Priority', sql.NVarChar, priority || 'Medium')
    .query(`
      INSERT INTO Cards (BoardId, ColumnId, Title, Description, Priority)
      OUTPUT INSERTED.*
      VALUES (@BoardId, @ColumnId, @Title, @Description, @Priority)
    `);

  return result.recordset[0];
};

// UPDATE card (content, move to column, update board if needed)
exports.updateCard = async (cardId, { title, description, priority, columnId, boardId }) => {
  const pool = await getPool();
  const request = pool.request().input('CardId', sql.Int, cardId);

  const updates = [];
  if (title !== undefined) { request.input('Title', sql.NVarChar, title); updates.push('Title = @Title'); }
  if (description !== undefined) { request.input('Description', sql.NVarChar, description); updates.push('Description = @Description'); }
  if (priority !== undefined) { request.input('Priority', sql.NVarChar, priority); updates.push('Priority = @Priority'); }
  if (columnId !== undefined) { request.input('ColumnId', sql.Int, columnId); updates.push('ColumnId = @ColumnId'); }
  if (boardId !== undefined) { request.input('BoardId', sql.Int, boardId); updates.push('BoardId = @BoardId'); }

  if (updates.length === 0) return await exports.getCardById(cardId);

  const query = `UPDATE Cards SET ${updates.join(', ')} WHERE CardId = @CardId; SELECT * FROM Cards WHERE CardId = @CardId;`;
  const result = await request.query(query);
  return result.recordset[0];
};

// DELETE card
exports.deleteCard = async (cardId) => {
  const pool = await getPool();
  const result = await pool.request()
    .input('CardId', sql.Int, cardId)
    .query('DELETE FROM Cards WHERE CardId = @CardId; SELECT @@ROWCOUNT AS affected;');

  return result.recordset[0].affected > 0;
};
