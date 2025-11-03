const boardModel = require('../models/boardModel');
const columnModel = require('../models/columnModel');

// GET all boards
exports.getAllBoards = async (req, res) => {
  try {
    const boards = await boardModel.getAllBoards();
    res.json({ success: true, data: boards });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET board by ID
exports.getBoardById = async (req, res) => {
  try {
    const board = await boardModel.getBoardById(req.params.boardId);
    if (!board) return res.status(404).json({ success: false, error: 'Board not found' });
    res.json({ success: true, data: board });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// CREATE new board
exports.createBoard = async (req, res) => {
  try {
    const { title, createDefaultColumns = true } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, error: 'Title is required' });
    }

    // Create the board
    const newBoard = await boardModel.createBoard({ title });

    // Optionally create default columns
    if (createDefaultColumns) {
      const defaultColumns = ['Backlog', 'To Do', 'Doing', 'Done'];
      for (let i = 0; i < defaultColumns.length; i++) {
        await columnModel.create(newBoard.BoardId, defaultColumns[i], i + 1);
      }
    }

    // Return the newly created board (columns not included in response by default)
    res.status(201).json({ success: true, data: newBoard });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// DELETE board
exports.deleteBoard = async (req, res) => {
  try {
    const deleted = await boardModel.deleteBoard(req.params.boardId);
    if (!deleted) return res.status(404).json({ success: false, error: 'Board not found' });

    res.json({ success: true, message: 'Board deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
