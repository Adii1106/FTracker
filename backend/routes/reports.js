const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');

const prisma = new PrismaClient();

router.get('/monthly', auth, async (req, res) => {
  try {
    const { month } = req.query; // Expecting 'YYYY-MM'

    // Simple implementation: Fetch all transactions and filter in JS (could also use DB raw query)
    const transactions = await prisma.transaction.findMany({
      where: { user_id: req.user.id },
      include: { category: true }
    });

    const report = {
      incomeByCategory: {},
      expenseByCategory: {},
      totalIncome: 0,
      totalExpense: 0
    };

    transactions.forEach(t => {
      // Filter by month string 'YYYY-MM'
      const tMonth = t.date.toISOString().substring(0, 7);
      if (month && tMonth !== month) return;

      const amount = parseFloat(t.amount);
      const catName = t.category ? t.category.name : 'Uncategorized';

      if (t.type === 'INCOME') {
        report.totalIncome += amount;
        report.incomeByCategory[catName] = (report.incomeByCategory[catName] || 0) + amount;
      } else {
        report.totalExpense += amount;
        report.expenseByCategory[catName] = (report.expenseByCategory[catName] || 0) + amount;
      }
    });

    res.json(report);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

module.exports = router;
