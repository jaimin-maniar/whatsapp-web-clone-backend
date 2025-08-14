const http = require('http');
const express = require('express');
const connectDB = require('./config/db');
const path = require("path");
require('dotenv').config();
const cors = require('cors');

const app = express();
app.use(express.json());

// Allowed origins
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://fluffy-crisp-9667f2.netlify.app'
];

// Dynamic CORS middleware
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // allow non-browser requests (like Postman)
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('CORS not allowed for this origin'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Connect to DB
connectDB();

// Webhook endpoint
app.use('/webhook', require('./routes/webhookRoutes'));

// REST API endpoints
app.use('/api', require('./routes/chatRoutes'));

module.exports = app;

const { initSocket } = require('./utils/socket');
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
initSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
