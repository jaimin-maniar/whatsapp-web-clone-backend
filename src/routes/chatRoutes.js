const express = require('express');
const router = express.Router();
const { getAllChats, getMessages, sendMessage } = require('../controllers/chatController');

router.get('/chats', getAllChats);
router.get('/messages/:wa_id', getMessages);
router.post('/messages', sendMessage);  

module.exports = router;
