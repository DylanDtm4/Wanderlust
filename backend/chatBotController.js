const getGeminiReply = require("./geminiService");
const db = require("./connect"); // ✅ this uses getDb()

const getReply = async (req, res) => {
  const { userId, message } = req.body;

  try {
    const reply = await getGeminiReply(message);

    // ✅ Use the getDb() from connect.js to insert into the "messages" collection
    const collection = db.getDb().collection("messages");

    await collection.insertOne({
      userId,
      userMessage: message,
      botMessage: reply,
      timestamp: new Date().toISOString(),
    });

    res.json({ reply });
  } catch (err) {
    console.error("Gemini Error:", err.message);
    res.json({ reply: "Wanderbot had a hiccup. Please try again later." });
  }
};

const saveMessage = async (req, res) => {
  const { userId, userMessage, botMessage } = req.body;

  try {
    const collection = db.getDb().collection("messages");

    await collection.insertOne({
      userId,
      userMessage,
      botMessage,
      timestamp: new Date().toISOString(),
    });

    res.status(201).json({ message: "Message saved to DB!" });
  } catch (err) {
    console.error("Save error:", err.message);
    res.status(500).json({ error: "Could not save message." });
  }
};

module.exports = { getReply, saveMessage };
