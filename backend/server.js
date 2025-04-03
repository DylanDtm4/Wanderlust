const connect = require("./connect");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const posts = require("./postRoutes");
const msgs = require("./msgRoutes");
const users = require("./userRoutes");

const app = express();
const PORT = 8080;

const server = http.createServer(app); // Wrap Express in HTTP server
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust this for security
  },
});

app.use(cors());
app.use(express.json());
app.use(posts);
app.use(msgs);
app.use(users);

// Socket.io Logic
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("joinChat", (chatId) => {
    socket.join(chatId);
    console.log(`User joined chat: ${chatId}`);
  });

  socket.on("sendMessage", async (data) => {
    let db = connect.getDb();
    let newMsg = {
      chatId: data.chatId,
      userId: data.userId,
      message: data.message,
      timestamp: new Date(),
    };

    // Store message in MongoDB
    let result = await db.collection("msgs").insertOne(newMsg);
    newMsg._id = result.insertedId;

    // Broadcast message in real-time
    io.to(data.chatId).emit("newMessage", newMsg);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start server
server.listen(PORT, () => {
  connect.connectToServer();
  console.log(`Server is running on port ${PORT}`);
});
