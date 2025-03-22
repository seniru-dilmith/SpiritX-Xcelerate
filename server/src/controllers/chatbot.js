const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const askChatbot = async (req, res) => {
  const { message } = req.body;
  try {
    let botResponse = "";

    const prompt = req.body.message;

    const result = await model.generateContent(prompt);

    if (result) {
      botResponse = result.response.text();
    } else {
      botResponse = "I don't have enough knowledge to answer that question.";
    }

    res.json({ response: botResponse });
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Error communicating with chatbot",
        error: err.message,
      });
  }
};

module.exports = { askChatbot };
