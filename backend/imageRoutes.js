const express = require("express");
const database = require("./connect");
const parser = require("./upload");
const ObjectId = require("mongodb").ObjectId;

let imageRoutes = express.Router();

// POST /upload - Upload image to Cloudinary & save URL to MongoDB
imageRoutes.post("/upload", parser.single("image"), async (req, res) => {
  if (!req.file?.path) {
    return res.status(400).json({ error: "No image uploaded" });
  }

  const imageUrl = req.file.path;

  try {
    const db = await database();
    const result = await db.collection("images").insertOne({
      url: imageUrl,
      createdAt: new Date(),
    });

    res
      .status(201)
      .json({
        message: "Image uploaded",
        url: imageUrl,
        id: result.insertedId,
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save image" });
  }
});

// (Optional) GET /images - Fetch all image URLs
imageRoutes.get("/images", async (req, res) => {
  try {
    const db = await database();
    const images = await db
      .collection("images")
      .find()
      .sort({ createdAt: -1 })
      .toArray();
    res.status(200).json(images);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch images" });
  }
});

module.exports = imageRoutes;
