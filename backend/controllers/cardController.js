const cardModel = require('../models/cardModel');
const boardModel = require('../models/boardModel');
const columnModel = require('../models/columnModel');

// GET all cards
exports.getAllCards = async (req, res) => {
  try {
    const cards = await cardModel.getAllCards();
    res.json({ success: true, data: cards });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET all cards for a board
exports.getCardsByBoard = async (req, res) => {
  try {
    const { boardId } = req.params;
    const board = await boardModel.getBoardById(boardId);
    if (!board) return res.status(404).json({ success: false, error: 'Board not found' });

    const cards = await cardModel.getCardsByBoard(boardId);
    res.json({ success: true, data: cards });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET specific card
exports.getCardById = async (req, res) => {
  try {
    const { cardId } = req.params;
    const card = await cardModel.getCardById(cardId);
    if (!card) return res.status(404).json({ success: false, error: 'Card not found' });

    res.json({ success: true, data: card });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// CREATE new card in a board & column
exports.createCard = async (req, res) => {
  try {
    const { boardId, columnId } = req.params; // columnId is required now
    const { title, description, priority } = req.body;

    if (!title) return res.status(400).json({ success: false, error: 'Title is required' });

    const board = await boardModel.getBoardById(boardId);
    if (!board) return res.status(404).json({ success: false, error: 'Board not found' });

    const column = await columnModel.getById(columnId);
    if (!column) return res.status(404).json({ success: false, error: 'Column not found' });

    const newCard = await cardModel.createCard(boardId, columnId, { title, description, priority });
    res.status(201).json({ success: true, data: newCard });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// UPDATE card (content or move between columns/boards)
exports.updateCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const { title, description, priority, columnId, boardId } = req.body;

    if (columnId) {
      const column = await columnModel.getById(columnId);
      if (!column) return res.status(404).json({ success: false, error: 'Target column not found' });
    }

    if (boardId) {
      const board = await boardModel.getBoardById(boardId);
      if (!board) return res.status(404).json({ success: false, error: 'Target board not found' });
    }

    const updatedCard = await cardModel.updateCard(cardId, { title, description, priority, columnId, boardId });
    res.json({ success: true, data: updatedCard });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


// DELETE card
exports.deleteCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const deleted = await cardModel.deleteCard(cardId);
    if (!deleted) return res.status(404).json({ success: false, error: 'Card not found' });

    res.json({ success: true, message: 'Card deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
