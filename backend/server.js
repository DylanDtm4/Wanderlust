const connect = require("./connect");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const posts = require("./postRoutes");
const msgs = require("./msgRoutes");
const users = require("./userRoutes");
const chatbot = require("./chatbotRoutes");

const app = express();
const PORT = 8080;

const server = http.createServer(app); // Wrap Express in HTTP server
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:8081"], // Remember to change!
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

let activeUsers = new Set(); // Stores online user IDs

app.use(cors());
app.use(express.json());
app.use(posts);
app.use(msgs);
app.use(users);
app.use(chatbot);

// Function to update user status in DB
const updateUserStatus = async (userId, isOnline) => {
  try {
    let db = connect.getDb();
    await db
      .collection("users")
      .updateOne(
        { _id: userId },
        { $set: { online: isOnline, lastSeen: new Date() } }
      );
  } catch (error) {
    console.error("Error updating user status:", error);
  }
};

// **Socket.io Logic**
let onlineUsers = {};
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("userOnline", async (userId) => {
    if (!userId) return;

    onlineUsers[userId] = socket.id;
    await updateUserStatus(userId, true);

    io.emit("activeUsers", Object.keys(onlineUsers));
  });

  socket.on("private_message", ({ senderID, receiverID, chatID, message }) => {
    const receiverSocketID = onlineUsers[receiverID];
    if (receiverSocketID) {
      io.to(receiverSocketID).emit("receive_message", {
        chatID,
        message,
        senderID,
      });
    }
  });

  socket.on("typing", ({ chatID, senderID, receiverID }) => {
    const receiverSocketID = onlineUsers[receiverID];
    if (receiverSocketID) {
      io.to(receiverSocketID).emit("typing", { chatID, senderID });
    }
  });

  socket.on("stop_typing", ({ chatID, senderID, receiverID }) => {
    const receiverSocketID = onlineUsers[receiverID];
    if (receiverSocketID) {
      io.to(receiverSocketID).emit("stop_typing", { chatID, senderID });
    }
  });

  socket.on("message_seen", ({ chatID, messageID, receiverID }) => {
    const receiverSocketID = onlineUsers[receiverID];
    if (receiverSocketID) {
      io.to(receiverSocketID).emit("message_seen", { chatID, messageID });
    }
  });

  socket.on("disconnect", async () => {
    const userId = Object.keys(onlineUsers).find(
      (key) => onlineUsers[key] === socket.id
    );
    if (userId) {
      delete onlineUsers[userId];
      await updateUserStatus(userId, false);
    }

    io.emit("activeUsers", Object.keys(onlineUsers));
  });
});

// Start server
server.listen(PORT, async () => {
  await connect.connectToServer();
  console.log(`Server is running on port ${PORT}`);
});
