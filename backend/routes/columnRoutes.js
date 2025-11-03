const express = require('express');
const router = express.Router();
const columnController = require('../controllers/columnController');

// Fetch all columns for a board
router.get('/board/:boardId', columnController.getAll);

// Fetch single column
router.get('/:columnId', columnController.getById);

// Create column
router.post('/:boardId', columnController.create);

// Update column
router.put('/:columnId', columnController.update);

// Delete column
router.delete('/:columnId', columnController.delete);

module.exports = router;
