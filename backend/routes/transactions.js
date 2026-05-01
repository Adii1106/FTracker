const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');

const prisma = new PrismaClient();

// Get all transactions
router.get('/', auth, async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { user_id: req.user.id },
      include: { category: true },
      orderBy: { date: 'desc' }
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Create a transaction
router.post('/', auth, async (req, res) => {
  try {
    const { category_id, type, amount, currency, date, description, receipt_url } = req.body;
    
    // Convert negative expenses to refunds logically (or just store the absolute/negative as provided)
    // Assuming amount is positive, type defines direction. If amount is negative, it reverses.
    
    const transaction = await prisma.transaction.create({
      data: {
        user_id: req.user.id,
        category_id: category_id || null,
        type,
        amount,
        currency: currency || 'USD',
        date: new Date(date),
        description,
        receipt_url
      }
    });

    res.status(201).json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
});

// Update a transaction
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { category_id, type, amount, currency, date, description, receipt_url } = req.body;

    const transaction = await prisma.transaction.update({
      where: { id, user_id: req.user.id },
      data: { category_id, type, amount, currency, date: new Date(date), description, receipt_url }
    });
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update transaction' });
  }
});

// Delete a transaction
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.transaction.delete({
      where: { id, user_id: req.user.id }
    });
    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
});

module.exports = router;
