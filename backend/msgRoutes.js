const express = require("express");
const database = require("./connect");
const ObjectId = require("mongodb").ObjectId;

let msgRoutes = express.Router();

// #1 - Retrieve All
msgRoutes.route("/msgs").get(async (request, response) => {
  let db = database.getDb();
  let data = await db.collection("msgs").find({}).toArray();
  if (data.length > 0) {
    response.json(data);
  } else {
    response.status(404).json({ error: "Data not found" });
  }
});

// #2 - Retrieve One
msgRoutes.route("/msgs/:id").get(async (request, response) => {
  try {
    let db = database.getDb();
    let msgId = request.params.id;

    if (!ObjectId.isValid(msgId)) {
      return response.status(400).json({ error: "Invalid message ID" });
    }

    let data = await db
      .collection("msgs")
      .findOne({ _id: new ObjectId(msgId) });

    if (!data) {
      return response.status(404).json({ error: "Message not found" });
    }

    response.json(data);
  } catch (error) {
    response.status(500).json({ error: "Internal Server Error" });
  }
});

// #3 - Create One
msgRoutes.route("/msgs").post(async (request, response) => {
  try {
    let db = database.getDb();
    let { chatID, senderID, message, type, attachments } = request.body;

    if (!chatID || !senderID || !message) {
      return response.status(400).json({ error: "Missing required fields" });
    }

    let mongoObject = {
      chatID,
      senderID,
      message,
      timestamp: new Date(),
      readBy: [],
      type: type || "text",
      attachments: attachments || [],
    };

    let data = await db.collection("msgs").insertOne(mongoObject);
    response.status(201).json({ insertedId: data.insertedId, ...mongoObject });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Internal Server Error" });
  }
});

// #4 - Update One Message (Edit message, update attachments)
msgRoutes.route("/msgs/:id").put(async (request, response) => {
  try {
    let db = database.getDb();
    let msgId = request.params.id;

    if (!ObjectId.isValid(msgId)) {
      return response.status(400).json({ error: "Invalid message ID" });
    }

    let updateFields = {};
    if (request.body.message) updateFields.message = request.body.message;
    if (request.body.type) updateFields.type = request.body.type;
    if (request.body.attachments)
      updateFields.attachments = request.body.attachments;

    if (Object.keys(updateFields).length === 0) {
      return response
        .status(400)
        .json({ error: "No fields provided for update" });
    }

    let result = await db
      .collection("msgs")
      .updateOne({ _id: new ObjectId(msgId) }, { $set: updateFields });

    if (result.matchedCount === 0) {
      return response.status(404).json({ error: "Message not found" });
    }

    response.json({
      modifiedCount: result.modifiedCount,
      updatedFields: updateFields,
    });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Internal Server Error" });
  }
});

// #5 - Delete One
msgRoutes.route("/msgs/:msgID").delete(async (request, response) => {
  try {
    let db = database.getDb();
    let msgId = request.params.msgID;

    if (!ObjectId.isValid(msgId)) {
      return response.status(400).json({ error: "Invalid message ID" });
    }

    let result = await db
      .collection("msgs")
      .deleteOne({ _id: new ObjectId(msgId) });

    if (result.deletedCount === 0) {
      return response.status(404).json({ error: "Message not found" });
    }

    response.json({ success: true, deletedCount: result.deletedCount });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Internal Server Error" });
  }
});

// #6 - Retrieve All (Messages from ONE chat)
msgRoutes.route("/msgs/chat/:chatID").get(async (request, response) => {
  try {
    let db = database.getDb();
    let chatID = request.params.chatID;

    if (!chatID) {
      return response.status(400).json({ error: "Chat ID is required" });
    }

    let messages = await db
      .collection("msgs")
      .find({ chatID })
      .sort({ timestamp: 1 })
      .toArray();

    response.json(messages);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Internal Server Error" });
  }
});

// #7 - Update One (Mark messages as READ)
msgRoutes.route("/msgs/read/:msgID").put(async (request, response) => {
  let db = database.getDb();
  let result = await db
    .collection("msgs")
    .updateOne(
      { _id: new ObjectId(request.params.msgID) },
      { $set: { read: true } }
    );
  response.json(result);
});

// #8 - Delete One (Chat)
msgRoutes.route("/msgs/chat/:chatID").delete(async (request, response) => {
  let db = database.getDb();
  let result = await db
    .collection("msgs")
    .deleteMany({ chatID: request.params.chatID });
  response.json({ deletedCount: result.deletedCount });
});
module.exports = msgRoutes;
