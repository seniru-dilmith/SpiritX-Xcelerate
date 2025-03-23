const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const socketIO = require("./socket");

dotenv.config();

const { sequelize, createDatabase } = require("./models");

const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/user");
const chatbotRoutes = require("./routes/chatbot");

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = socketIO.init(server);

const PORT = process.env.PORT;

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", userRoutes);
app.use("/api/chatbot", chatbotRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Server is running");
});

const startServer = async () => {
  try {
    console.log("🔃 Ensuring database exists...");
    const needToPopulate = await createDatabase(); // Ensure the database is created before connecting
    console.log("✅ Database check complete.");

    console.log("🔃 Syncing database...");
    await sequelize.sync({ alter: true });
    console.log("✅ Database synced.");

    if (needToPopulate) {
      console.log("🔃 Populating sample data if needed...");
      const populateData = require("./SampleDataPopulation");
      await populateData();
      console.log("✅ Sample data populated.");
    }

    server.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server startup error:", error);
    process.exit(1); // Exit the process if something goes wrong
  }
};

startServer();
