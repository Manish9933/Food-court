const express = require('express');
const router = express.Router();
const FoodItem = require('../models/FoodItem');
const axios = require('axios');

// Supported models with automatic fallback
const GROQ_MODELS = [
  'qwen/qwen3.8-27b',
  'openai/gpt-oss-20b'
];

// @desc    Process AI Chat queries using Groq API
// @route   POST /api/chat
router.post('/', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ message: "Provide a prompt" });

  try {
    const allItems = await FoodItem.find({}).lean();
    const menuContext = allItems.length > 0
      ? allItems.map(item => `- ${item.name}: ₹${item.price} (${item.category || 'General'})`).join('\n')
      : "- Truffle Mushroom Burger: ₹14.99\n- Butter Naan: ₹45.00\n- Paneer Butter Masala: ₹180.00\n- Veg Biryani: ₹200.00";

    const systemPrompt = `You are FoodGenie AI, a warm, energetic, and highly knowledgeable restaurant concierge. 
Help customers choose dishes, explain tastes, or track their orders. Keep responses concise, appetizing, and friendly (under 3 sentences).
Always recommend items from our actual menu when asked about food:
${menuContext}`;

    let answer = null;
    let lastError = null;

    // Try available Groq models in sequence
    for (const model of GROQ_MODELS) {
      try {
        const response = await axios.post(
          'https://api.groq.com/openai/v1/chat/completions',
          {
            model,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 300
          },
          {
            headers: { 'Authorization': `Bearer ${process.env.GROQ_API_KEY}` },
            timeout: 7000
          }
        );

        answer = response.data?.choices?.[0]?.message?.content;
        if (answer) break;
      } catch (err) {
        lastError = err;
        console.warn(`Groq model ${model} failed, trying next...:`, err.response?.data?.error?.message || err.message);
      }
    }

    // If Groq answered, return it
    if (answer) {
      return res.json({ answer: answer.trim() });
    }

    // Smart Fallback if Groq API is unreachable
    console.error('All Groq models failed:', lastError?.response?.data || lastError?.message);
    
    // Pick 1-2 random items from menu for a friendly fallback response
    const pick = allItems.length > 0 ? allItems[Math.floor(Math.random() * allItems.length)] : null;
    const fallbackMessage = pick 
      ? `Hey! I'd love to recommend our popular ${pick.name} (₹${pick.price})! It's one of our guests' absolute favorites today. Would you like to try it?`
      : "Hey there! I recommend checking out our Chef's Specials on the Menu page — you'll find incredible flavors there!";

    res.json({ answer: fallbackMessage });

  } catch (error) {
    console.error('Chat error:', error.message);
    res.json({ 
      answer: "I'm right here! Feel free to ask me for recommendations like burgers, curries, or biryani from our menu!" 
    });
  }
});

module.exports = router;
