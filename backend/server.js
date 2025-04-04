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
    origin: ["http://your-frontend.com"], // Remember to change!
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
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("userOnline", async (userId) => {
    if (!userId) return;

    activeUsers.add(userId);
    await updateUserStatus(userId, true);

    // Broadcast updated user list
    io.emit("activeUsers", Array.from(activeUsers));
  });

  socket.on("disconnect", async () => {
    console.log("User disconnected:", socket.id);

    let userId = [...activeUsers].find((id) => socket.userId === id);
    if (userId) {
      activeUsers.delete(userId);
      await updateUserStatus(userId, false);
    }

    io.emit("activeUsers", Array.from(activeUsers));
  });
});

// Start server
server.listen(PORT, async () => {
  await connect.connectToServer();
  console.log(`Server is running on port ${PORT}`);
});
