const express = require('express');
const { askChatbot } = require('../controllers/chatbot');
const { isAuthenticated } = require('../middleware/general');
const router = express.Router();

// Chatbot endpoint using Gemini API (placeholder implementation)
router.post('/', isAuthenticated, askChatbot);

module.exports = router;
