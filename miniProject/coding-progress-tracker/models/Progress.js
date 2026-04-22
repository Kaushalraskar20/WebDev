const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  sheetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sheet',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  platform: {
    type: String,
    enum: ['LeetCode', 'CodeChef', 'HackerRank', 'Codeforces', 'GeeksForGeeks'],
    required: true
  },
  solved: {
    type: Number,
    required: true,
    min: 1
  }
}, { timestamps: true });

module.exports = mongoose.model('Progress', progressSchema);
