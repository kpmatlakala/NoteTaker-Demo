const express = require('express');
const router = express.Router();
const boardController = require('../controllers/boardController');

// GET all boards
router.get('/', boardController.getAllBoards);

// GET a single board by ID
router.get('/:boardId', boardController.getBoardById);

// POST create a new board
router.post('/', boardController.createBoard);

// PUT update a board (optional, can implement later)
// router.put('/:boardId', boardController.updateBoard);

// DELETE a board
router.delete('/:boardId', boardController.deleteBoard);

module.exports = router;
