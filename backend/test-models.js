require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listModels() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // There isn't a direct listModels in the base SDK without a different client,
    // so we'll just try the most common names until one hits.
    const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro", "gemini-1.0-pro"];
    
    console.log("🔍 Testing Gemini models...");
    
    for (const modelName of models) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("test");
        const text = result.response.text();
        console.log(`✅ ${modelName}: WORKED! (Response: ${text.substring(0, 10)}...)`);
        process.exit(0); // Exit once we find one that works
      } catch (err) {
        console.log(`❌ ${modelName}: Failed (${err.message.substring(0, 50)}...)`);
      }
    }
  } catch (error) {
    console.error("Critical Error:", error);
  }
}

listModels();
