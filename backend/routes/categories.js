const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');

const prisma = new PrismaClient();

// Get all categories for user
router.get('/', auth, async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      where: { user_id: req.user.id }
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Create a category
router.post('/', auth, async (req, res) => {
  try {
    const { name, type } = req.body;
    const category = await prisma.category.create({
      data: {
        name,
        type,
        user_id: req.user.id
      }
    });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// Delete a category
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    // Transactions using this category will have category_id set to null because of ON DELETE SET NULL
    await prisma.category.delete({
      where: { id, user_id: req.user.id }
    });
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

module.exports = router;
