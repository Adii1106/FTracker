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
    
    // 1. Basic Input Validation
    if (!type || !amount || !date || !description) {
      return res.status(400).json({ error: 'Type, amount, date, and description are required' });
    }
    if (isNaN(amount)) {
      return res.status(400).json({ error: 'Amount must be a valid number' });
    }

    const transactionDate = new Date(date);

    // 2. Edge Case: Negative Amounts (Refunds)
    // If a user passes a negative expense, it mathematically acts as a refund.
    // We allow this, as our Dashboard automatically handles negative numbers.
    const parsedAmount = parseFloat(amount);

    const transaction = await prisma.transaction.create({
      data: {
        user_id: req.user.id,
        category_id: category_id || null,
        type,
        amount: parsedAmount,
        currency: currency || 'USD',
        date: transactionDate,
        description,
        receipt_url
      }
    });

    let alertMessage = null;

    // 3. Edge Case: Budget Overrun Notification Logic
    if (type === 'EXPENSE' && category_id) {
      const monthString = transactionDate.toISOString().substring(0, 7); // e.g., '2026-05'

      // Find if there's a budget for this category and month
      const budget = await prisma.budget.findUnique({
        where: {
          user_id_category_id_month: {
            user_id: req.user.id,
            category_id,
            month: monthString
          }
        }
      });

      if (budget) {
        // Calculate total spent in this category for the month
        const startOfMonth = new Date(`${monthString}-01T00:00:00.000Z`);
        const endOfMonth = new Date(startOfMonth);
        endOfMonth.setMonth(endOfMonth.getMonth() + 1);

        const categoryTransactions = await prisma.transaction.findMany({
          where: {
            user_id: req.user.id,
            category_id,
            type: 'EXPENSE',
            date: {
              gte: startOfMonth,
              lt: endOfMonth
            }
          }
        });

        const totalSpent = categoryTransactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);

        // If over budget, trigger a notification
        if (totalSpent > parseFloat(budget.limit_amount)) {
          const category = await prisma.category.findUnique({ where: { id: category_id } });
          alertMessage = `Alert: You have exceeded your ${monthString} budget for ${category.name}! Spent: $${totalSpent}, Limit: $${budget.limit_amount}`;
          
          await prisma.notification.create({
            data: {
              user_id: req.user.id,
              message: alertMessage
            }
          });

          console.log(`[EMAIL MOCK] Sending email to user: ${alertMessage}`);
          // Future: Send email via Sendgrid/Nodemailer here
        }
      }
    }

    res.status(201).json({ transaction, alert: alertMessage });
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
      data: { 
        category_id, 
        type, 
        amount: parseFloat(amount), 
        currency, 
        date: new Date(date), 
        description, 
        receipt_url 
      }
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
