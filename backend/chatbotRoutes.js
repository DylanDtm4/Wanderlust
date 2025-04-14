const express = require("express");
const router = express.Router();

router.post("/chatbot", (req, res) => {
  const { message } = req.body;

  // Basic reply logic (replace with AI logic or connect to external API)
  let reply = "Hmm, I didn't get that.";
  if (message.toLowerCase().includes("hello")) {
    reply = "Hey there, traveler! How can I assist you today?";
  } else if (message.toLowerCase().includes("recommend")) {
    reply = "Sure! Are you looking for beaches, cities, or nature spots?";
  }

  res.json({ reply });
});

router.get("/chatbot/messages/:userId", async (req, res) => {
  const db = connect.getDb();
  const { userId } = req.params;

  const chat = await db.collection("chatbot").findOne({ userId });
  res.json(chat?.messages || []);
});

router.post("/chatbot/message", async (req, res) => {
  const db = connect.getDb();
  const { userId, userMessage, botMessage } = req.body;

  const messagePair = [
    { sender: "user", text: userMessage, timestamp: new Date() },
    { sender: "bot", text: botMessage, timestamp: new Date() },
  ];

  await db
    .collection("chatbot")
    .updateOne(
      { userId },
      { $push: { messages: { $each: messagePair } } },
      { upsert: true }
    );

  res.json({ success: true });
});

module.exports = router;
