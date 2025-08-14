// backend/importSamplePayloads.js
const axios = require("axios")
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const processWebhookPayload = require('./src/services/payloadProcessor'); // Unified processor
const insertMessage = require('./src/services/messageService')
const updateStatus = require ('./src/services/messageService.js');
const { handleWebhook } = require('./src/controllers/webhookController.js');
// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB connected: ${mongoose.connection.db.databaseName}`);
  } catch (err) {
    console.error(`❌ DB connection error: ${err}`);
    process.exit(1);
  }
}

async function importPayloads() {
  await connectDB();

  const folderPath = path.join(__dirname, 'payloads', 'sample_payloads');

  if (!fs.existsSync(folderPath)) {
    console.error(`❌ Folder not found: ${folderPath}`);
    process.exit(1);
  }

  const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.json'));
  if (!files.length) {
    console.error(`⚠ No JSON files found in ${folderPath}`);
    process.exit(1);
  }

  for (const file of files) {
    const filePath = path.join(folderPath, file);
    console.log(`📄 Processing ${file}...`);

    try {
      const rawData = fs.readFileSync(filePath, 'utf-8');
      const payload = JSON.parse(rawData);
      
      await axios.post("http://localhost:5000/webhook", payload)
    } catch (err) {
      console.error(`❌ Error processing ${file}: ${err.message}`);
    }
  }



  await mongoose.connection.close();
  process.exit(0);
}

importPayloads();
