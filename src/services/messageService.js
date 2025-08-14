const Message = require('../models/Message');
const { getIO } = require('../utils/socket');

// Insert or upsert a message
async function insertMessage(data) {
  const result = await Message.updateOne(
    { meta_msg_id: data.meta_msg_id }, 
    { $setOnInsert: data }, 
    { upsert: true }
  );
  // If message is inserted (not just matched)
  if (result.upsertedCount > 0) {
    getIO().emit('new_message', data);
  }
  return result;
}

// Update status
async function updateStatus(meta_msg_id, status, status_timestamp) {
  const result = await Message.updateOne(
    { meta_msg_id },
    { $set: { status, status_timestamp } }
  );
  if (result.modifiedCount > 0) {
    getIO().emit('status_update', { meta_msg_id, status, status_timestamp });
  }
  return result;
}

async function getChatList(myNumber) {
  return await Message.aggregate([
    {
      $match: {
        $or: [{ from: myNumber }, { to: myNumber }]
      }
    },
    {
      $sort: { timestamp: -1 }
    },
    {
      $group: {
        _id: "$wa_id",
        name: { $first: "$name" },
        lastMessage: { $first: "$message_body" },
        messageType: { $first: "$message_type"},
        timestamp: { $first: "$timestamp" },
        status: { $first: "$status" }
      }
    },
    { $sort: { timestamp: -1 } }
  ]);
}


async function getMessagesByWaId(wa_id) {
  return Message.find({ wa_id }).sort({ timestamp: 1 });
}

module.exports = {
  insertMessage,
  updateStatus,
  getChatList,
  getMessagesByWaId,
};
