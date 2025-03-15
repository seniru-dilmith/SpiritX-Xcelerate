const express = require('express');
const { askChatbot } = require('../controllers/chatbot');
const router = express.Router();

// Chatbot endpoint using Gemini API (placeholder implementation)
router.post('/', askChatbot);

module.exports = router;
