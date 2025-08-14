const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  wa_id: String,
  name: String,
  meta_msg_id: { type: String, index: true, unique: true },
  from: String,
  to: String,
  timestamp: Date,
  message_type: String,
  message_body: String,
  status: { type: String, default: 'sent' },
  status_timestamp: Date,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema, 'processed_messages');
