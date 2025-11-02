const boardModel = require('../models/boardModel');

// GET all cards in a board
exports.getAllCards = (req, res) => {
  try {
    const { boardId } = req.params;
    const board = boardModel.getBoardById(boardId);
    
    if (!board) {
      return res.status(404).json({ success: false, error: 'Board not found' });
    }

    // Collect all cards from all columns
    const allCards = [];
    board.columns.forEach(column => {
      column.cards.forEach(card => {
        allCards.push({ ...card, columnId: column.id });
      });
    });

    res.json({ success: true, data: allCards });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET specific card
exports.getCardById = (req, res) => {
  try {
    const { boardId, cardId } = req.params;
    const card = boardModel.getCardById(boardId, cardId);
    
    if (!card) {
      return res.status(404).json({ success: false, error: 'Card not found' });
    }

    res.json({ success: true, data: card });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// CREATE new card
exports.createCard = (req, res) => {
  try {
    const { boardId } = req.params;
    const { title, description, priority, columnId } = req.body;
    
    if (!title || !columnId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Title and columnId are required' 
      });
    }

    const newCard = boardModel.createCard(boardId, {
      title,
      description: description || '',
      priority: priority || 'medium',
      columnId
    });

    if (!newCard) {
      return res.status(404).json({ success: false, error: 'Board or column not found' });
    }

    res.status(201).json({ success: true, data: newCard });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// UPDATE card
exports.updateCard = (req, res) => {
  try {
    const { boardId, cardId } = req.params;
    const updates = req.body;

    const updatedCard = boardModel.updateCard(boardId, cardId, updates);
    
    if (!updatedCard) {
      return res.status(404).json({ success: false, error: 'Card not found' });
    }

    res.json({ success: true, data: updatedCard });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// DELETE card
exports.deleteCard = (req, res) => {
  try {
    const { boardId, cardId } = req.params;
    const deleted = boardModel.deleteCard(boardId, cardId);
    
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Card not found' });
    }

    res.json({ success: true, message: 'Card deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};