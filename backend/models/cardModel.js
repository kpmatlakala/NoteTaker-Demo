const sql = require('mssql');
const { getPool } = require('../db');

// GET all cards
exports.getAllCards = async () => {
  const pool = await getPool();
  const result = await pool.request().query('SELECT * FROM Cards ORDER BY CreatedAt ASC');
  return result.recordset;
};

// GET cards by board
exports.getCardsByBoard = async (boardId) => {
  const pool = await getPool();
  const result = await pool.request()
    .input('BoardId', sql.Int, boardId)
    .query('SELECT * FROM Cards WHERE BoardId = @BoardId ORDER BY CreatedAt ASC');
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
exports.createCard = async (boardId, { title, description, priority }) => {
  const pool = await getPool();
  const result = await pool.request()
    .input('BoardId', sql.Int, boardId)
    .input('Title', sql.NVarChar, title)
    .input('Description', sql.NVarChar, description)
    .input('Priority', sql.NVarChar, priority)
    .query(`
      INSERT INTO Cards (BoardId, Title, Description, Priority)
      VALUES (@BoardId, @Title, @Description, @Priority);
      SELECT SCOPE_IDENTITY() AS CardId;
    `);

  return {
    CardId: result.recordset[0].CardId,
    BoardId: boardId,
    Title: title,
    Description: description,
    Priority: priority
  };
};


// UPDATE card
exports.updateCard = async (cardId, { content, boardId }) => {
  const pool = await getPool();
  const request = pool.request().input('CardId', sql.Int, cardId);

  let query = 'UPDATE Cards SET ';
  const updates = [];
  if (content !== undefined) {
    request.input('Content', sql.NVarChar, content);
    updates.push('Content = @Content');
  }
  if (boardId !== undefined) {
    request.input('BoardId', sql.Int, boardId);
    updates.push('BoardId = @BoardId');
  }

  if (updates.length === 0) return await exports.getCardById(cardId); // nothing to update

  query += updates.join(', ') + ' WHERE CardId = @CardId; SELECT * FROM Cards WHERE CardId = @CardId;';
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
