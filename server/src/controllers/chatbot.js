const { GoogleGenerativeAI } = require("@google/generative-ai");
const { Op } = require("sequelize");
const { User, Player, Team } = require("../models");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const askChatbot = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized: user not authenticated" });
  }
  
  const { message } = req.body;
  try {
    // Retrieve the authenticated user.
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Start with the user's original message.
    let enrichedPrompt = message;
    
    // Check if the message is asking for suggestions.
    const lowerMessage = message.toLowerCase();
    const keywords = ["suggest", "recommend", "buy", "afford", "player"];
    const needsSuggestions = keywords.some(keyword => lowerMessage.includes(keyword));
    
    if (needsSuggestions) {
      // Count the players already in the user's team.
      const teamCount = await Team.count({ where: { userId: req.user.id } });
      const remainingSlots = 11 - teamCount;
      
      if (remainingSlots > 0) {
        // Get IDs of players already in the team.
        const teamRecords = await Team.findAll({ where: { userId: req.user.id } });
        const teamPlayerIds = teamRecords.map(record => record.playerId);
        
        // Find affordable players not already on the team.
        const affordablePlayers = await Player.findAll({
          where: {
            value_in_rupees: { [Op.lte]: user.budget },
            id: { [Op.notIn]: teamPlayerIds },
          },
          order: [["points", "DESC"]],
          limit: remainingSlots,
        });
        
        if (affordablePlayers.length > 0) {
          const suggestions = affordablePlayers
            .map((p) => 
              // For non-admin users, hide points.
              user.isAdmin 
                ? `${p.name} (Cost: Rs. ${p.value_in_rupees}, Points: ${p.points.toFixed(2)})`
                : `${p.name} (Cost: Rs. ${p.value_in_rupees})`
            )
            .join("; ");
          enrichedPrompt += `\n\nBased on your current budget of Rs. ${user.budget} and the ${remainingSlots} remaining slot(s) in your team, here are some player suggestions: ${suggestions}`;
        } else {
          enrichedPrompt += `\n\nIt appears your budget of Rs. ${user.budget} is too low to buy any additional players for your remaining ${remainingSlots} slot(s).`;
        }
      } else {
        enrichedPrompt += `\n\nYour team is already complete.`;
      }
    }
    
    const result = await model.generateContent(enrichedPrompt);
    let botResponse = "";
    if (result && result.response) {
      const responseText = result.response.text();
      botResponse = responseText instanceof Promise ? await responseText : responseText;
    } else {
      botResponse = "I don't have enough knowledge to answer that question.";
    }
    
    res.json({ response: botResponse });
  } catch (err) {
    console.error("Error in askChatbot:", err);
    res.status(500).json({
      message: "Error communicating with chatbot",
      error: err.message,
    });
  }
};

module.exports = { askChatbot };
