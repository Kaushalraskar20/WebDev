const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  student: String,
  subject: String,
  status: String
});

module.exports = mongoose.model('Attendance', attendanceSchema);
