const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Subject = require('../models/subject');
const Attendance = require('../models/attendance');

// Login page
router.get('/', (req, res) => {
  res.render('login');
});

// Login logic
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if(user){
    req.session.user = user;
    res.redirect('/dashboard');
  } else {
    res.send("Invalid Login");
  }
});

// Dashboard
router.get('/dashboard', (req, res) => {
  if(!req.session.user) return res.redirect('/');
  res.render('dashboard');
});

// Subjects
router.get('/subjects', async (req, res) => {
  const subjects = await Subject.find();
  res.render('subjects', { subjects });
});

router.post('/subjects', async (req, res) => {
  await new Subject({ name: req.body.name }).save();
  res.redirect('/subjects');
});

// Attendance
router.get('/attendance', async (req, res) => {
  const data = await Attendance.find();
  res.render('attendance', { data });
});

router.post('/attendance', async (req, res) => {
  const { student, subject, status } = req.body;
  await new Attendance({ student, subject, status }).save();
  res.redirect('/attendance');
});

module.exports = router;
