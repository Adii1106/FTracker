const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');

const prisma = new PrismaClient();

// Get budgets for a specific month
router.get('/:month', auth, async (req, res) => {
  try {
    const { month } = req.params; // e.g., '2026-05'
    const budgets = await prisma.budget.findMany({
      where: { user_id: req.user.id, month },
      include: { category: true }
    });
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch budgets' });
  }
});

// Create or Update budget for a category and month
router.post('/', auth, async (req, res) => {
  try {
    const { category_id, limit_amount, month } = req.body;
    
    // Upsert budget
    const budget = await prisma.budget.upsert({
      where: {
        user_id_category_id_month: {
          user_id: req.user.id,
          category_id,
          month
        }
      },
      update: { limit_amount },
      create: {
        user_id: req.user.id,
        category_id,
        limit_amount,
        month
      }
    });

    res.status(201).json(budget);
  } catch (error) {
    res.status(500).json({ error: 'Failed to set budget' });
  }
});

module.exports = router;
