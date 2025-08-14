const { insertMessage, updateStatus } = require('../services/messageService');
const processWebhookPayload = require('../services/payloadProcessor');

// Handles incoming webhook POSTs (for live mode)
exports.handleWebhook = async (req, res) => {
  processWebhookPayload(req, res)
};
