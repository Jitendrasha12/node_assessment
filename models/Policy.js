const mongoose = require('mongoose');
require('./Lob');
require('./Carrier');
require('./Agent');
require('./Account');
require('./User');

const PolicySchema = new mongoose.Schema({
  policy_number: { type: String, required: true },
  policy_start_date: Date,
  policy_end_date: Date,
  policy_category: { type: mongoose.Schema.Types.ObjectId, ref: 'Lob' },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Carrier' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
  agent: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent' }
}, { timestamps: true });
module.exports = mongoose.model('Policy', PolicySchema);
