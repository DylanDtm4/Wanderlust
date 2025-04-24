import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { app } from "../config/firebase";
import { useRouter } from "expo-router";
import { ActivityIndicator } from "react-native";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 40;

const Spots = () => {
  const [loadingImages, setLoadingImages] = useState({});
  const [posts, setPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const router = useRouter();

  const auth = getAuth(app);
  const currentUser = auth.currentUser;

  if (!currentUser) {
    console.log("No user is signed in.");
    return;
  }

  const userId = currentUser.uid;

  const handleCardPress = (
    postID,
    picture,
    location,
    username,
    city,
    bestTime,
    upvotes,
    upvoted,
    downvoted,
    duration,
    lowerBudget,
    upperBudget,
    activities,
    comments,
    saved,
    rating,
    rated,
    title,
    description,
    itinerary
  ) => {
    router.push({
      pathname: "/post",
      params: {
        postID,
        picture,
        location,
        username,
        city,
        bestTime,
        upvotes,
        upvoted,
        downvoted,
        duration,
        lowerBudget,
        upperBudget,
        activities,
        comments,
        saved,
        rating,
        rated,
        title,
        description,
        itinerary,
      },
    });
  };

  const handleSave = async (postID) => {
    try {
      const res = await fetch(
        `https://wanderlustbackend-s12f.onrender.com/users/${userId}/save-post`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ postID }),
        }
      );

      const data = await res.json();
      console.log("Save response:", data);

      if (data.success) {
        alert("Post saved!");
      } else {
        throw new Error("Save failed");
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("Could not save post");
    }
  };

  const handleUnsave = async (postID) => {
    try {
      const res = await fetch(
        `https://wanderlustbackend-s12f.onrender.com/users/${userId}/remove-saved-post`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ postID }),
        }
      );

      const data = await res.json();
      console.log("Unsave response:", data);

      if (data.success) {
        alert("Post removed from saved posts.");
      } else {
        throw new Error("Unsave failed");
      }
    } catch (err) {
      console.error("Unsave error:", err);
      alert("Could not remove post from saved list");
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // adjust to following only later!
        const res = await fetch(
          `https://wanderlustbackend-s12f.onrender.com/posts`
        );
        const data = await res.json();
        const displayPosts = await Promise.all(
          data.map((p) => {
            return {
              id: p._id,
              picture: p.picture,
              location: p.location,
              username: p.username,
              city: p.city,
              bestTime: p.bestTime,
              upvotes: p.upvotes,
              upvoted: p.upvoted,
              downvoted: p.downvoted,
              duration: p.duration,
              lowerBudget: p.lowerBudget,
              upperBudget: p.upperBudget,
              activities: p.activities,
              comments: p.comments,
              saved: p.saved,
              rating: p.rating,
              rated: p.rated,
              title: p.title,
              description: p.description,
              itinerary: p.itinerary,
            };
          })
        );
        const sortedPosts = displayPosts.sort(
          (a, b) => parseFloat(b.rating) - parseFloat(a.rating)
        );
        setPosts(sortedPosts);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    const fetchSavedPosts = async () => {
      if (!userId) return;

      try {
        const res = await fetch(
          `https://wanderlustbackend-s12f.onrender.com/users/${userId}`
        );
        const data = await res.json();
        if (data.savedPosts) {
          setSavedPosts(data.savedPosts);
        } else {
          console.error("No saved posts found");
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchPosts();
    fetchSavedPosts();
  });

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          {posts.map((post) => (
            <TouchableOpacity
              key={post.id}
              style={styles.spotCard}
              activeOpacity={0.9}
              onPress={() =>
                handleCardPress(
                  post.id,
                  post.picture,
                  post.location,
                  post.username,
                  post.city,
                  post.bestTime,
                  post.upvotes,
                  post.upvoted,
                  post.downvoted,
                  post.duration,
                  post.lowerBudget,
                  post.upperBudget,
                  post.activities,
                  post.comments,
                  post.saved,
                  post.rating,
                  post.rated,
                  post.title,
                  post.description,
                  JSON.stringify(post.itinerary)
                )
              }
            >
              <View style={styles.imageWrapper}>
                {loadingImages[post.id] && (
                  <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#386BF6" />
                  </View>
                )}

                <Image
                  key={post.picture} // helps React know it's a fresh image
                  source={{ uri: post.picture }}
                  style={styles.spotImage}
                  resizeMode="cover"
                  onLoadStart={() =>
                    setLoadingImages((prev) => ({ ...prev, [post.id]: true }))
                  }
                  onLoadEnd={() =>
                    setLoadingImages((prev) => ({ ...prev, [post.id]: false }))
                  }
                />
              </View>

              <View style={styles.spotContent}>
                <View style={styles.textContainer}>
                  <Text style={styles.spotName}>{post.title}</Text>
                  <Text style={styles.spotLocation}>
                    <Ionicons name="location" size={14} color="#666" />{" "}
                    {post.location}
                  </Text>
                </View>

                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <Text style={styles.ratingText}>{post.rating}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.saveButton,
                  {
                    backgroundColor: savedPosts.includes(post.id)
                      ? "#386BF6"
                      : "rgba(255, 255, 255, 0.1)",
                  },
                ]}
                onPress={() => {
                  savedPosts.includes(post.id)
                    ? handleUnsave(post.id)
                    : handleSave(post.id);
                }}
              >
                <Ionicons name="bookmark-outline" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingTop: 20,
  },
  scrollContainer: {
    paddingBottom: 110,
    paddingTop: 50,
  },
  spotCard: {
    width: CARD_WIDTH,
    marginBottom: 25,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
    alignSelf: "center",
  },
  spotImage: {
    width: "100%",
    height: 220,
  },
  spotContent: {
    padding: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
  },
  spotName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  spotLocation: {
    fontSize: 14,
    color: "#666",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 215, 0, 0.15)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginLeft: 10,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1a1a1a",
    marginLeft: 5,
  },
  saveButton: {
    position: "absolute",
    top: 15,
    right: 15,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 8,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  imageWrapper: {
    width: "100%",
    height: 220,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e0e0e0",
  },

  loaderContainer: {
    position: "absolute",
    zIndex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
});

export default Spots;
