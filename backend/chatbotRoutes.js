const express = require("express");
const router = express.Router();
const { getReply, saveMessage } = require("./chatBotController");

router.post("/chatbot/reply", getReply);
router.post("/chatbot/message", saveMessage);

module.exports = router;
