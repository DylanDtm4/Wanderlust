const express = require("express");
const database = require("./connect");
const ObjectId = require("mongodb").ObjectId;

let userRoutes = express.Router();

// #1 - Retrieve All
userRoutes.route("/users").get(async (request, response) => {
  let db = database.getDb();
  let data = await db.collection("users").find({}).toArray();
  if (data.length > 0) {
    response.json(data);
  } else {
    response.status(404).json({ error: "Data not found" });
  }
});

// #2 - Retrieve One
userRoutes.route("/users/:id").get(async (request, response) => {
  let db = database.getDb();
  let data = await db
    .collection("users")
    .findOne({ _id: new ObjectId(request.params.id) });
  if (Object.keys(data).length > 0) {
    response.json(data);
  } else {
    response.status(404).json({ error: "Data not found" });
  }
});

// #3 - Create One
userRoutes.route("/create/user").post(async (request, response) => {
  try {
    console.log("POST /create/user hit");
    console.log("Request body:", request.body);

    const { userID, username, email } = request.body;
    if (!userID || !username || !email) {
      console.log("Missing fields");
      return response.status(400).json({ message: "Missing fields" });
    }

    const mongoObject = {
      userID,
      username,
      email,
      bio: "",
      age: null,
      ratings: [],
      friends: [],
      following: [],
      createdPosts: [],
      savedPosts: [],
      notifications: [],
      interests: [],
      online: false,
      lastSeen: new Date(),
    };

    const db = database.getDb();
    const result = await db.collection("users").insertOne(mongoObject);
    console.log("User created in MongoDB:", result);
    response.status(201).json(result);
  } catch (error) {
    console.error("Error inserting user:", error);
    response
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
});

// #4 - Update One
userRoutes.route("/users/:id").put(async (request, response) => {
  let db = database.getDb();
  let mongoObject = {
    $set: {
      email: request.body.email,
      username: request.body.username,
      bio: request.body.bio,
      age: request.body.age,
      ratings: request.body.ratings,
      friends: request.body.friends,
      following: request.body.following,
      createdPosts: request.body.createdPosts,
      savedPosts: request.body.savedPosts,
      notifications: request.body.notifications,
      interests: request.body.interests,
      online: request.body.online,
      lastSeen: request.body.lastSeen,
    },
  };
  let data = await db
    .collection("users")
    .updateOne({ _id: new ObjectId(request.params.id) }, mongoObject);
  response.json(data);
});

// #5 - Delete One
userRoutes.route("/users/:id").delete(async (request, response) => {
  let db = database.getDb();
  let data = await db
    .collection("users")
    .deleteOne({ _id: new ObjectId(request.params.id) });
  response.json(data);
});

// #6 - Retrieve One (Get all user's following ids)
userRoutes.route("/get/following/:id").get(async (request, response) => {
  let db = database.getDb();
  let data = await db.collection("users").findOne(
    { _id: new ObjectId(request.params.id) },
    {
      projection: {
        following: 1,
      },
    }
  );

  if (data) {
    response.json(data.following);
  } else {
    response.status(404).json({ error: "User not found" });
  }
});

// #7 - Login / Authentication
userRoutes.route("/login").post(async (req, res) => {
  const db = database.getDb();
  const { email, password } = req.body;

  const user = await db.collection("users").findOne({ email });

  if (!user || user.password !== password) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  res.json({ success: true, user });
});

// #8 - Follow User
userRoutes.route("/users/:id/follow").post(async (req, res) => {
  const db = database.getDb();
  const followId = req.body.followId;

  const result = await db.collection("users").updateOne(
    { _id: new ObjectId(req.params.id) },
    { $addToSet: { following: followId } } // prevents duplicates
  );

  res.json({ success: result.modifiedCount > 0 });
});

// #9 - Unfollow User
userRoutes.route("/users/:id/unfollow").post(async (req, res) => {
  const db = database.getDb();
  const unfollowId = req.body.unfollowId;

  const result = await db
    .collection("users")
    .updateOne(
      { _id: new ObjectId(req.params.id) },
      { $pull: { following: unfollowId } }
    );

  res.json({ success: result.modifiedCount > 0 });
});

// #10 - Get Online Users
userRoutes.route("/users/online").get(async (req, res) => {
  try {
    let db = database.getDb();
    let users = await db.collection("users").find({ online: true }).toArray();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = userRoutes;
