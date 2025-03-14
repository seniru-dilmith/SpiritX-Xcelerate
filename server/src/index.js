const express = require("express");
const session = require("express-session");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const { sequelize } = require("./models");

const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/user");
const chatbotRoutes = require("./routes/chatbot");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", userRoutes); // For players, team, budget, leaderboard
app.use("/api/chatbot", chatbotRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Sync database, populate data if CSV files exist, then start server
sequelize
  .sync({ alter: true })
  .then(async () => {
    const populateData = require("./SampleDataPopulation");
    await populateData();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });
