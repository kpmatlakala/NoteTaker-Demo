const express = require('express');
const router = express.Router();
const boardController = require('../controllers/boardController');

// GET all boards
router.get('/', boardController.getAllBoards);

// GET a single board by ID
router.get('/:id', boardController.getBoardById);

// POST create a new board
router.post('/', boardController.createBoard);

// PUT update a board
router.put('/:id', boardController.updateBoard);

// DELETE a board
router.delete('/:id', boardController.deleteBoard);

module.exports = router;