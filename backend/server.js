const connect = require("./connect");
const express = require("express");
const cors = require("cors");
const posts = require("./postRoutes");
const msgs = require("./msgRoutes");
const users = require("./userRoutes");

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());
app.use(posts);
app.use(msgs);
app.use(users);

app.get("/", (req, res) => {
  res.send("Server is up and running!");
});

app.listen(PORT, async () => {
  await connect.connectToServer(); // ensure connection before using DB
  console.log(`Server is running on port ${PORT}`);
});
