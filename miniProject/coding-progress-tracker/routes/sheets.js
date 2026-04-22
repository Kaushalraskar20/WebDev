const express = require('express');
const router = express.Router();
const Sheet = require('../models/Sheet');
const Progress = require('../models/Progress');
const isAuthenticated = require('../middleware/auth');

// ─── Dashboard — list all sheets ─────────────────────────────
router.get('/dashboard', isAuthenticated, async (req, res) => {
  try {
    const sheets = await Sheet.find({ userId: req.session.userId }).sort({ createdAt: -1 });
    res.render('dashboard', { sheets, userName: req.session.userName });
  } catch (err) {
    res.send('Error loading dashboard.');
  }
});

// ─── Create Sheet ─────────────────────────────────────────────
// GET /sheet/create — show create form
router.get('/sheet/create', isAuthenticated, (req, res) => {
  res.render('create-sheet', { error: null });
});

// POST /sheet/create — save new sheet
router.post('/sheet/create', isAuthenticated, async (req, res) => {
  const { name } = req.body;
  try {
    await Sheet.create({ name, userId: req.session.userId });
    res.redirect('/dashboard');
  } catch (err) {
    res.render('create-sheet', { error: 'Could not create sheet.' });
  }
});

// ─── View Sheet Details ───────────────────────────────────────
router.get('/sheet/:id', isAuthenticated, async (req, res) => {
  try {
    const sheet = await Sheet.findOne({ _id: req.params.id, userId: req.session.userId });
    if (!sheet) return res.send('Sheet not found.');

    const progress = await Progress.find({ sheetId: sheet._id }).sort({ date: -1 });
    res.render('sheet-detail', { sheet, progress });
  } catch (err) {
    res.send('Error loading sheet.');
  }
});

// ─── Delete Sheet ─────────────────────────────────────────────
router.post('/sheet/:id/delete', isAuthenticated, async (req, res) => {
  try {
    await Sheet.findOneAndDelete({ _id: req.params.id, userId: req.session.userId });
    // Also delete all progress entries for this sheet
    await Progress.deleteMany({ sheetId: req.params.id });
    res.redirect('/dashboard');
  } catch (err) {
    res.send('Error deleting sheet.');
  }
});

module.exports = router;
