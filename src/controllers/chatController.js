// controllers/chatController.js
const { getChatList, getMessagesByWaId, insertMessage } = require('../services/messageService');

exports.getAllChats = async (req, res) => {
  // Expect req.query.myNumber from frontend
  const myNumber = req.query.myNumber;
  res.json(await getChatList(myNumber));
};

exports.getMessages = async (req, res) => {
  res.json(await getMessagesByWaId(req.params.wa_id));
};

exports.sendMessage = async (req, res) => {
  const { wa_id, name, message_body, from } = req.body; 
  const meta_msg_id = `local-${Date.now()}`;

  await insertMessage({
    wa_id,
    name,
    meta_msg_id,
    from,            
    to: wa_id,
    timestamp: new Date(),
    message_type: 'text',
    message_body,
    status: 'sent'
  });

  res.json({ success: true });
};
