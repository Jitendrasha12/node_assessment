const mongoose = require('mongoose');

const ScheduledMessageSchema = new mongoose.Schema({
  message: String,
  runAt: Date,
  createdAt: { type: Date, default: Date.now },
  executed: { type: Boolean, default: false }
});

module.exports = mongoose.model('ScheduledMessage', ScheduledMessageSchema);
