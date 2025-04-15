const express = require("express");
const database = require("./connect");
const parser = require("./upload");
const ObjectId = require("mongodb").ObjectId;

let postRoutes = express.Router();

// #1 - Retrieve All
postRoutes.route("/posts").get(async (request, response) => {
  let db = database.getDb();
  let data = await db.collection("posts").find({}).toArray();
  if (data) {
    response.json(data);
  } else {
    response.status(404).json({ error: "Data not found" });
  }
});
// #2 - Retrieve One
postRoutes.route("/posts/:postID").get(async (request, response) => {
  let db = database.getDb();
  let data = await db
    .collection("posts")
    .findOne({ _id: new ObjectId(request.params.postID) });
  if (data) {
    response.json(data);
  } else {
    response.status(404).json({ error: "Data not found" });
  }
});
// #3 - Create One
postRoutes.route("/create/post").post(async (request, response) => {
  let db = database.getDb();
  console.log(request.body);
  let mongoObject = {
    userID: request.body.userID,
    username: request.body.username,
    title: request.body.title,
    location: request.body.location,
    city: request.body.city,
    description: request.body.description,
    picture: request.body.picture,
    rated: false,
    rating: 0,
    allRatings: [],
    numRatings: 0,
    review: null,
    allReviews: [],
    activities: request.body.activities,
    bestTime: request.body.bestTime,
    duration: request.body.duration,
    upvotes: 0,
    upvoted: false,
    downvoted: false,
    saved: false,
    comments: [],
    lowerBudget: request.body.lowerBudget,
    upperBudget: request.body.upperBudget,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  let data = await db.collection("posts").insertOne(mongoObject);
  response.json(data);
});
// #4 - Update One
postRoutes.route("/posts/:postID").put(async (request, response) => {
  let db = database.getDb();
  let mongoObject = {
    $set: {
      title: request.body.title,
      location: request.body.location,
      city: request.body.city,
      description: request.body.description,
      picture: request.body.picture,
      rated: request.body.rated,
      rating: request.body.rating,
      allRatings: request.body.allRatings,
      numRatings: request.body.numRatings,
      review: request.body.review,
      allReviews: request.body.allReviews,
      activities: request.body.activities,
      bestTime: request.body.bestTime,
      duration: request.body.duration,
      upvotes: request.body.upvotes,
      upvoted: request.body.upvoted,
      downvoted: request.body.downvoted,
      saved: request.body.saved,
      comments: request.body.comments,
      lowerBudget: request.body.lowerBudget,
      upperBudget: request.body.upperBudget,
      updatedAt: new Date(),
    },
  };
  let data = await db
    .collection("posts")
    .updateOne({ _id: new ObjectId(request.params.postID) }, mongoObject);
  response.json(data);
});
// #5 - Delete One
postRoutes.route("/posts/:postID").delete(async (request, response) => {
  let db = database.getDb();
  let data = await db
    .collection("posts")
    .deleteOne({ _id: new ObjectId(request.params.postID) });
  response.json(data);
});

// #6 - Retrieve All (Initial Post View Home Page, retrieve all posts from following)
postRoutes
  .route("/get/following/posts/:userid")
  .get(async (request, response) => {
    let db = database.getDb();

    // Step 1: Get the user's following list
    let user = await db
      .collection("users")
      .findOne(
        { _id: new ObjectId(request.params.userid) },
        { projection: { following: 1 } }
      );

    if (!user || !user.following) {
      return response
        .status(404)
        .json({ error: "User not found or has no followings" });
    }

    // Step 2: Retrieve posts from followed users
    let posts = await db
      .collection("posts")
      .find(
        { userID: { $in: user.following } },
        {
          projection: {
            title: 1,
            location: 1,
            rating: 1,
            pictures: 1,
            saved: 1,
          },
        }
      )
      .toArray();

    response.json(posts);
  });

// #7 - Retrieve One (Display Post Data after clicking on post)
postRoutes.route("/get/click/posts/:postID").get(async (request, response) => {
  let db = database.getDb();
  let data = await db.collection("posts").findOne(
    { _id: new ObjectId(request.params.postID) },
    {
      projection: {
        author: 1,
        title: 1,
        location: 1,
        rating: 1,
        picture: 1,
        saved: 1,
        upvotes: 1,
        upvoted: 1,
        downvoted: 1,
        activities: 1,
        lowerBudget: 1,
        upperBudget: 1,
        bestTime: 1,
        duration: 1,
        comments: 1,
      },
    }
  );
  if (data) {
    response.json(data);
  } else {
    response.status(404).json({ error: "Data not found" });
  }
});

// #8 - Post One (Adding comment to post)
postRoutes
  .route("/posts/add/comment/:postID")
  .post(async (request, response) => {
    let db = database.getDb();
    let newComment = request.body.comment;

    if (!newComment) {
      return response.status(400).json({ error: "Comment cannot be empty" });
    }

    let result = await db
      .collection("posts")
      .updateOne(
        { _id: new ObjectId(request.params.postID) },
        { $push: { comments: newComment } }
      );

    if (result.modifiedCount > 0) {
      response.json({ success: true, message: "Comment added!" });
    } else {
      response
        .status(404)
        .json({ error: "Post not found or comment not added" });
    }
  });

// #9 - Post One (Adding rating to post)
postRoutes.route("/posts/rating/:postID").post(async (request, response) => {
  let db = database.getDb();
  let newRating = request.body.rating;

  if (!newRating || newRating < 1 || newRating > 5) {
    return response
      .status(400)
      .json({ error: "Rating must be between 1 and 5" });
  }

  let post = await db
    .collection("posts")
    .findOne({ _id: new ObjectId(request.params.postID) });

  if (!post) {
    return response.status(404).json({ error: "Post not found" });
  }

  let updatedAllRatings = [...post.allRatings, newRating]; // Append new rating
  let updatedNumRatings = post.numRatings + 1; // Increment count
  let updatedRating =
    updatedAllRatings.reduce((sum, r) => sum + r, 0) / updatedNumRatings; // Calculate new average

  let result = await db.collection("posts").updateOne(
    { _id: new ObjectId(request.params.postID) },
    {
      $push: { allRatings: newRating }, // Append rating
      $inc: { numRatings: 1 }, // Increase rating count
      $set: { rating: updatedRating.toFixed(2) }, // Update average rating (rounded to 2 decimals)
    }
  );

  if (result.modifiedCount > 0) {
    response.json({
      success: true,
      message: "Rating added!",
      newAvgRating: updatedRating.toFixed(2),
      numRatings: updatedNumRatings,
    });
  } else {
    response.status(500).json({ error: "Failed to update rating" });
  }
});

// #10 - Update One (Upvoting post)
postRoutes.route("/posts/upvote/postID").post(async (request, response) => {
  let db = database.getDb();
  let result = await db.collection("posts").updateOne(
    { _id: new ObjectId(request.params.postID) },
    {
      $inc: { upvotes: 1 }, // Increase upvote count
      $set: { upvoted: true, downvoted: false }, // upvoted, downvoted logic
    }
  );
  if (result.modifiedCount > 0) {
    response.json({
      success: true,
      message: "Upvote added!",
      Upvotes: request.body.upvotes,
      Upvoted: request.body.upvoted,
      Downvoted: request.body.downvoted,
    });
  } else {
    response.status(500).json({ error: "Failed to update upvotes" });
  }
});

// #11 - Update One (Downvoting post)
postRoutes.route("/posts/downvote/:postID").post(async (request, response) => {
  let db = database.getDb();
  let result = await db.collection("posts").updateOne(
    { _id: new ObjectId(request.params.postID) },
    {
      $inc: { upvotes: -1 }, // Decrease upvote count
      $set: { upvoted: false, downvoted: true }, // upvoted, downvoted logic
    }
  );
  if (result.modifiedCount > 0) {
    response.json({
      success: true,
      message: "Downvote added!",
      Upvotes: request.body.upvotes,
      Upvoted: request.body.upvoted,
      Downvoted: request.body.downvoted,
    });
  } else {
    response.status(500).json({ error: "Failed to update upvotes" });
  }
});

// #12 - Update One (Saving post)
postRoutes.route("/posts/save/:postID").post(async (request, response) => {
  let db = database.getDb();
  let result = await db.collection("posts").updateOne(
    { _id: new ObjectId(request.params.postID) },
    {
      $set: { saved: true },
    }
  );
  if (result.modifiedCount > 0) {
    response.json({
      success: true,
      message: "Saved post!",
    });
  } else {
    response.status(500).json({ error: "Failed to save post" });
  }
});

// #12 - Update One (Unsaving post)
postRoutes.route("/posts/unsave/:postID").post(async (request, response) => {
  let db = database.getDb();
  let result = await db.collection("posts").updateOne(
    { _id: new ObjectId(request.params.postID) },
    {
      $set: { saved: false },
    }
  );
  if (result.modifiedCount > 0) {
    response.json({
      success: true,
      message: "Unsaved post!",
    });
  } else {
    response.status(500).json({ error: "Failed to unsave post" });
  }
});

// #14 - Retrieve All (Posts from ONE user, for profile pages)
postRoutes.route("/get/posts/:userid").get(async (request, response) => {
  let db = database.getDb();
  let posts = await db
    .collection("posts")
    .find(
      { userID: request.params.userid },
      {
        projection: {
          title: 1,
          pictures: 1,
        },
      }
    )
    .toArray();

  response.json(posts);
});

// #15 - Retrieve All (Saved posts from ONE user)
postRoutes.route("/get/saved/posts/:userid").get(async (request, response) => {
  let db = database.getDb();
  let posts = await db
    .collection("posts")
    .find(
      { userID: request.params.userid },
      { saved: true },
      {
        projection: {
          title: 1,
          location: 1,
          pictures: 1,
        },
      }
    )
    .toArray();

  response.json(posts);
});

// #16 - Retrieve All (from location)
postRoutes.route("/get/posts/:location").get(async (request, response) => {
  let db = database.getDb();
  const location = request.params.location; // get the location from URL
  let posts = await db
    .collection("posts")
    .find(
      { location: { $in: [location] } },
      {
        projection: {
          author: 1,
          location: 1,
          pictures: 1,
        },
      }
    )
    .toArray();

  response.json(posts);
});

module.exports = postRoutes;
