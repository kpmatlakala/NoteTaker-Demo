const boardModel = require('../models/boardModel');

// GET all boards
exports.getAllBoards = (req, res) => {
  try {
    const boards = boardModel.getAllBoards();
    res.json({ success: true, data: boards });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET board by ID
exports.getBoardById = (req, res) => {
  try {
    const board = boardModel.getBoardById(req.params.id);
    if (!board) {
      return res.status(404).json({ success: false, error: 'Board not found' });
    }
    res.json({ success: true, data: board });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// CREATE new board
exports.createBoard = (req, res) => {
  try {
    const { name, columns } = req.body;
    
    if (!name) {
      return res.status(400).json({ success: false, error: 'Board name is required' });
    }

    const newBoard = boardModel.createBoard({ name, columns });
    res.status(201).json({ success: true, data: newBoard });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// UPDATE board
exports.updateBoard = (req, res) => {
  try {
    const { name, columns } = req.body;
    const updatedBoard = boardModel.updateBoard(req.params.id, { name, columns });
    
    if (!updatedBoard) {
      return res.status(404).json({ success: false, error: 'Board not found' });
    }

    res.json({ success: true, data: updatedBoard });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// DELETE board
exports.deleteBoard = (req, res) => {
  try {
    const deleted = boardModel.deleteBoard(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Board not found' });
    }

    res.json({ success: true, message: 'Board deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};