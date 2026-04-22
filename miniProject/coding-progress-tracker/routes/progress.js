const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');
const Sheet = require('../models/Sheet');
const isAuthenticated = require('../middleware/auth');

// ─── Add Progress ─────────────────────────────────────────────
// GET /progress/add?sheetId=xxx — show form
router.get('/progress/add', isAuthenticated, async (req, res) => {
  const { sheetId } = req.query;
  try {
    const sheet = await Sheet.findOne({ _id: sheetId, userId: req.session.userId });
    if (!sheet) return res.send('Sheet not found.');

    const platforms = ['LeetCode', 'CodeChef', 'HackerRank', 'Codeforces', 'GeeksForGeeks'];
    res.render('add-progress', { sheet, platforms, error: null });
  } catch (err) {
    res.send('Error loading form.');
  }
});

// POST /progress/add — save progress entry
router.post('/progress/add', isAuthenticated, async (req, res) => {
  const { sheetId, date, platform, solved } = req.body;
  try {
    await Progress.create({ sheetId, date, platform, solved: parseInt(solved) });
    res.redirect(`/sheet/${sheetId}`);
  } catch (err) {
    const sheet = await Sheet.findById(sheetId);
    const platforms = ['LeetCode', 'CodeChef', 'HackerRank', 'Codeforces', 'GeeksForGeeks'];
    res.render('add-progress', { sheet, platforms, error: 'Could not save progress.' });
  }
});

// ─── Delete Progress Entry ────────────────────────────────────
router.post('/progress/:id/delete', isAuthenticated, async (req, res) => {
  try {
    const entry = await Progress.findById(req.params.id);
    if (!entry) return res.send('Entry not found.');

    const sheetId = entry.sheetId;
    await Progress.findByIdAndDelete(req.params.id);
    res.redirect(`/sheet/${sheetId}`);
  } catch (err) {
    res.send('Error deleting entry.');
  }
});

module.exports = router;
