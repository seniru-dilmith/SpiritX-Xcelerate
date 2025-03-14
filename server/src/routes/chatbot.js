const express = require('express');
const router = express.Router();
const axios = require('axios');

// Chatbot endpoint using Gemini API (placeholder implementation)
router.post('/', async (req, res) => {
  const { message } = req.body;
  try {
    // Here you would call the Gemini API using axios (or another HTTP client)
    // For now, we simulate a response.
    let botResponse = '';

    if (message.toLowerCase().includes('player')) {
      botResponse = 'Here is some information about the player.';
    } else if (message.toLowerCase().includes('best team')) {
      botResponse = 'The best possible team is [dummy team list].';
    } else {
      botResponse = "I don't have enough knowledge to answer that question.";
    }

    res.json({ response: botResponse });
  } catch (err) {
    res.status(500).json({ message: 'Error communicating with chatbot', error: err.message });
  }
});

module.exports = router;
