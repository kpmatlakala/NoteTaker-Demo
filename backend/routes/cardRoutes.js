const express = require('express');
const router = express.Router();
const cardController = require('../controllers/cardController');

// GET cards by board (must come first)
router.get('/board/:boardId', cardController.getCardsByBoard);

// GET a specific card
router.get('/:cardId', cardController.getCardById);

// GET all cards (optional global)
router.get('/', cardController.getAllCards);


// CREATE new card in a specific board
router.post('/board/:boardId/column/:columnId/', cardController.createCard);

// UPDATE a card
router.put('/:cardId', cardController.updateCard);

// DELETE a card
router.delete('/:cardId', cardController.deleteCard);

module.exports = router;
