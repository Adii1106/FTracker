const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');

const prisma = new PrismaClient();

router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all transactions
    const transactions = await prisma.transaction.findMany({
      where: { user_id: userId }
    });

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(t => {
      const amount = parseFloat(t.amount);
      if (t.type === 'INCOME') {
        totalIncome += amount;
      } else if (t.type === 'EXPENSE') {
        totalExpense += amount;
      }
    });

    const totalBalance = totalIncome - totalExpense;

    // Fetch recent transactions
    const recentTransactions = await prisma.transaction.findMany({
      where: { user_id: userId },
      orderBy: { date: 'desc' },
      take: 5,
      include: { category: true }
    });

    res.json({
      totalBalance,
      totalIncome,
      totalExpense,
      recentTransactions
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

module.exports = router;
