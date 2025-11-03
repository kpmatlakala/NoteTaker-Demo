const cardModel = require('../models/cardModel');
const boardModel = require('../models/boardModel');

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

// CREATE new card in a specific board
exports.createCard = async (req, res) => {
  try {
    const { boardId } = req.params;
    const { title, description, priority } = req.body;

    // Validate required fields
    if (!title) 
      return res.status(400).json({ success: false, error: 'Title is required' });

    // Check if board exists
    const board = await boardModel.getBoardById(boardId);
    if (!board) 
      return res.status(404).json({ success: false, error: 'Board not found' });

    // Create the new card
    const newCard = await cardModel.createCard(boardId, { title, description, priority });

    // Respond with the created card
    res.status(201).json({ success: true, data: newCard });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


// UPDATE card
exports.updateCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const { content, boardId } = req.body; // optional boardId if moving card

    const updatedCard = await cardModel.updateCard(cardId, { content, boardId });
    if (!updatedCard) return res.status(404).json({ success: false, error: 'Card not found' });

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
