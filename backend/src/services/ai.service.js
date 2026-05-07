const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.getFoodRecommendations = async (userPrompt, menuItems) => {
  try {
    const menuContext = menuItems.map(item => 
      `${item.name} ($${item.price}): ${item.description} [Category: ${item.category}]`
    ).join('\n');

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a helpful restaurant assistant. Suggest 2-3 food items based ONLY on the provided menu list. User will provide a budget or mood. 
          Respond in JSON format: { "suggestions": [{ "name": "", "reason": "" }], "explanation": "" }`
        },
        {
          role: "user",
          content: `Menu:\n${menuContext}\n\nUser Query: ${userPrompt}`
        }
      ],
      response_format: { type: "json_object" }
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error("OpenAI Error:", error);
    throw new Error("Failed to get AI recommendations");
  }
};
