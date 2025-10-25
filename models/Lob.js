const mongoose = require('mongoose');
const LobSchema = new mongoose.Schema({
  category_name: String
}, { timestamps: true });
module.exports = mongoose.model('Lob', LobSchema);
