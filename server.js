const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();
const path = require('path');
const app = express();
app.use(cors());
app.use(express.json({ limit: '5mb' }));
const analyzeImageHandler = require('./api/analyze-image');

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Calorie Counter API (Gemini Pro Vision)',
    timestamp: new Date().toISOString()
  });
});

// API route should be before static/catch-all
app.post('/api/analyze-image', async (req, res) => {
  try {
    await analyzeImageHandler(req, res);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

app.use(express.static(path.join(__dirname, 'client/build')));
app.post('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`✅ Server running on port ${PORT}`);
//   console.log(`🌐 Health check: http://localhost:${PORT}/health`);
//   console.log(`📱 API endpoint: http://localhost:${PORT}/analyze-image`);
//   console.log('🔑 Make sure GEMINI_API_KEY is set in your .env file.');
// });

module.exports = app;
