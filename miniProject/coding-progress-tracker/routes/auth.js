const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// ─── Register ───────────────────────────────────────────────
// GET /register — show register form
router.get('/register', (req, res) => {
  res.render('register', { error: null });
});

// POST /register — create new user
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Check if email already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.render('register', { error: 'Email already registered.' });
    }

    // Hash password and save user
    const hashed = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashed });

    res.redirect('/login');
  } catch (err) {
    res.render('register', { error: 'Something went wrong. Try again.' });
  }
});

// ─── Login ───────────────────────────────────────────────────
// GET /login — show login form
router.get('/login', (req, res) => {
  res.render('login', { error: null });
});

// POST /login — verify credentials and set session
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.render('login', { error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render('login', { error: 'Invalid email or password.' });
    }

    // Save user info in session
    req.session.userId = user._id;
    req.session.userName = user.name;

    res.redirect('/dashboard');
  } catch (err) {
    res.render('login', { error: 'Something went wrong. Try again.' });
  }
});

// ─── Logout ──────────────────────────────────────────────────
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

module.exports = router;
