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
  let db = database.getDb();
  let data = await db
    .collection("msgs")
    .findOne({ _id: new ObjectId(request.params.id) });
  if (Object.keys(data).length > 0) {
    response.json(data);
  } else {
    response.status(404).json({ error: "Data not found" });
  }
});

// #3 - Create One
msgRoutes.route("/msgs").post(async (request, response) => {
  let db = database.getDb();
  let mongoObject = {
    chatID: request.body.chatID, // Which chat this message belongs to
    senderID: request.body.senderID, // Who sent it
    message: request.body.message, // Text content
    timestamp: new Date(), // Store the current time
    readBy: [], // Starts empty, filled when users read it
    type: request.body.type || "text", // Defaults to "text"
    attachments: request.body.attachments || [], // Any files/images/videos
  };
  let data = await db.collection("msgs").insertOne(mongoObject);
  response.json(data);
});

// #4 - Update One Message (Edit message, update attachments)
msgRoutes.route("/msgs/:id").put(async (request, response) => {
  let db = database.getDb();
  let updateFields = {};

  if (request.body.message) {
    updateFields.message = request.body.message;
  }

  if (request.body.type) {
    updateFields.type = request.body.type;
  }

  if (request.body.attachments) {
    updateFields.attachments = request.body.attachments;
  }

  let data = await db
    .collection("msgs")
    .updateOne(
      { _id: new ObjectId(request.params.id) },
      { $set: updateFields }
    );

  response.json(data);
});

// #5 - Delete One
msgRoutes.route("/msgs/:msgID").delete(async (request, response) => {
  let db = database.getDb();
  let data = await db
    .collection("msgs")
    .deleteOne({ _id: new ObjectId(request.params.msgID) });
  response.json(data);
});

// #6 - Retrieve All (Messages from ONE chat)
msgRoutes.route("/msgs/chat/:chatID").get(async (request, response) => {
  let db = database.getDb();
  let messages = await db
    .collection("msgs")
    .find({ chatID: request.params.chatID })
    .sort({ timestamp: 1 }) // Oldest to newest
    .toArray();

  response.json(messages);
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
