const express = require('express');
const router = express.Router({ mergeParams: true });
const cardController = require('../controllers/cardController');

// GET all cards in a board
router.get('/', cardController.getAllCards);

// GET a specific card
router.get('/:cardId', cardController.getCardById);

// POST create a new card
router.post('/', cardController.createCard);

// PUT update a card (including moving between columns)
router.put('/:cardId', cardController.updateCard);

// DELETE a card
router.delete('/:cardId', cardController.deleteCard);

module.exports = router;