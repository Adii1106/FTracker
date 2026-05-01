const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');

const prisma = new PrismaClient();

// Get profile and user currency
router.get('/', auth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { profile: true }
    });

    let profileData = user.profile || { shortTermGoal: '', longTermGoal: '', notes: '' };
    // Attach the preferred currency from the User table to the response
    profileData.preferred_currency = user.preferred_currency;

    res.json(profileData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Upsert profile and update currency
router.post('/', auth, async (req, res) => {
  try {
    const { shortTermGoal, longTermGoal, notes, preferred_currency } = req.body;
    
    // Update User's preferred currency if provided
    if (preferred_currency) {
      await prisma.user.update({
        where: { id: req.user.id },
        data: { preferred_currency }
      });
    }

    // Upsert the Profile data
    const profile = await prisma.profile.upsert({
      where: { user_id: req.user.id },
      update: { shortTermGoal, longTermGoal, notes },
      create: { user_id: req.user.id, shortTermGoal, longTermGoal, notes }
    });
    
    res.json({ ...profile, preferred_currency });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;
