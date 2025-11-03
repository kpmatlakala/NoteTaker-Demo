const Column = require("../models/columnModel");

const columnController = {
  async getAll(req, res) {
    try {
      const { boardId } = req.params;
      const columns = await Column.getAll(boardId);
      res.json(columns);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch columns' });
    }
  },

  async getById(req, res) {
    try {
      const { columnId } = req.params;
      const column = await Column.getById(columnId);
      if (!column) return res.status(404).json({ error: 'Column not found' });
      res.json(column);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch column' });
    }
  },

  async create(req, res) {
    try {
      const { boardId } = req.params;
      const { title, position } = req.body;
      const newColumn = await Column.create(boardId, title, position);
      res.status(201).json(newColumn);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to create column' , errorDetails: err.message });
    }
  },

  async update(req, res) {
    try {
      const { columnId } = req.params;
      const { title, position } = req.body;
      const updatedColumn = await Column.update(columnId, title, position);
      res.json(updatedColumn);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update column' });
    }
  },

  async delete(req, res) {
    try {
      const { columnId } = req.params;
      await Column.delete(columnId);
      res.json({ message: 'Column deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to delete column' });
    }
  }
};

module.exports = columnController;
