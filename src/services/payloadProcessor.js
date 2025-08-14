const { insertMessage, updateStatus } = require('./messageService');

async function processWebhookPayload(req, res) {
  try {
    const data = req.body;

    // Debug log the payload so you can see what's actually arriving

    // Safe extraction of entry array
    const entry = data?.metaData?.entry || data?.entry;
    if (!Array.isArray(entry)) {
      console.warn("Invalid webhook payload: missing entry array");
      return res.sendStatus(400);
    }

    entry.forEach(ent => {
      if (!Array.isArray(ent?.changes)) return;

      ent.changes.forEach(change => {
        // Incoming/outgoing message
        if (change.field === 'messages' && Array.isArray(change.value?.messages)) {
          const contact = change.value?.contacts?.[0];
          const message = change.value?.messages?.[0];
          if (!contact || !message) return;

          insertMessage({
            wa_id: contact.wa_id,
            name: contact.profile?.name || '',
            meta_msg_id: message.id,
            from: message.from,
            to: contact.wa_id === message.from
              ? change.value?.metadata?.display_phone_number
              : contact.wa_id,
            timestamp: new Date(Number(message.timestamp) * 1000),
            message_type: message.type,
            message_body: message.text?.body || '',
            status: 'sent'
          });
        }

        // Status update
        else if (change.field === 'messages' && Array.isArray(change.value?.statuses)) {
          const s = change.value.statuses[0];
          updateStatus(s.id, s.status, new Date(Number(s.timestamp) * 1000));
        }
      });
    });

    res.sendStatus(200);
  } catch (err) {
    console.error("Webhook error:", err);
    res.sendStatus(500);
  }
}

module.exports = processWebhookPayload;
