const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/coding-tracker';

// ─── Connect to MongoDB ───────────────────────────────────────
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// ─── Middleware ───────────────────────────────────────────────
app.use(express.urlencoded({ extended: true }));   // parse form data
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Session setup — stores session in MongoDB
app.use(session({
  secret: 'codingtracker_secret_key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: MONGO_URI }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 }  // 1 day
}));

// ─── View Engine ──────────────────────────────────────────────
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ─── Routes ───────────────────────────────────────────────────
app.use('/', require('./routes/auth'));
app.use('/', require('./routes/sheets'));
app.use('/', require('./routes/progress'));

// Root redirect
app.get('/', (req, res) => {
  if (req.session.userId) return res.redirect('/dashboard');
  res.redirect('/login');
});

// ─── Start Server ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
