const express = require('express');
const router = express.Router();
const FoodItem = require('../models/FoodItem');
const axios = require('axios');

// @desc    Process AI Chat queries using Mega-Fast Groq API
// @route   POST /api/chat
router.post('/', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ message: "Provide a prompt" });

  try {
    const allItems = await FoodItem.find({});
    const menuContext = allItems.map(item => `- ${item.name}: $${item.price}`).join('\n');

    const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: `You are FoodGenie AI. Menu:\n${menuContext}` },
        { role: "user", content: prompt }
      ]
    }, {
      headers: { 'Authorization': `Bearer ${process.env.GROQ_API_KEY}` }
    });

    const answer = response.data.choices[0].message.content;
    res.json({ answer });

  } catch (error) {
    console.error('Groq Error:', error.response?.data || error.message);
    res.status(500).json({ message: "Genie is taking a nap. Use Groq! 🧞‍♂️" });
  }
});

module.exports = router;
