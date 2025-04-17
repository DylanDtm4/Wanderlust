const serverless = require("serverless-http");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

// Load env variables
dotenv.config();

// DB connect
const connect = require("../connect");

// Routes
const posts = require("../postRoutes");
const msgs = require("../msgRoutes");
const users = require("../userRoutes");
const images = require("../imageRoutes");
const chatbot = require("../chatbotRoutes");

// Create app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to DB (only once)
connect.connectToServer();

// Routes
app.use(posts);
app.use(msgs);
app.use(users);
app.use(images);
app.use(chatbot);

// Test route
app.get("/", (req, res) => {
  res.send("Server is up and running on Vercel!");
});

// Export for Vercel
module.exports.handler = serverless(app);
