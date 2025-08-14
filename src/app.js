const express = require('express');
const connectDB = require('./config/db');
const path = require("path")
require('dotenv').config();
const cors = require('cors')
const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', // your frontend dev server
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

connectDB();


// Webhook endpoint (for live/test)
app.use('/webhook', require('./routes/webhookRoutes'));

// REST API endpoints for frontend
app.use('/api', require('./routes/chatRoutes'));




module.exports = app;
