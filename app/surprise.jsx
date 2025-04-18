import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
  Easing,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { getAuth } from "firebase/auth";
import { app } from "../config/firebase";

const { width, height } = Dimensions.get("window");

const SurprisePage = () => {
  const [posts, setPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [nonSavedPosts, setNonSavedPosts] = useState([]);

  const auth = getAuth(app);
  const currentUser = auth.currentUser;

  if (!currentUser) {
    console.log("No user is signed in.");
    return;
  }

  const userId = currentUser.uid;
  const router = useRouter();
  const [currentLocation, setCurrentLocation] = useState(null);
  const [sparkleAnim] = useState(new Animated.Value(0));

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
    description
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
    const fetchPostsAndSaved = async () => {
      try {
        const [postsRes, savedRes] = await Promise.all([
          fetch("https://wanderlustbackend-s12f.onrender.com/posts"),
          fetch(`https://wanderlustbackend-s12f.onrender.com/users/${userId}`),
        ]);
        const postsData = await postsRes.json();
        const savedData = await savedRes.json();

        const formattedPosts = postsData.map((p) => ({
          id: p._id,
          username: p.username,
          title: p.title,
          location: p.location,
          city: p.city,
          rating: p.rating,
          picture: p.picture,
          saved: p.saved,
          bestTime: p.bestTime,
          upvotes: p.upvotes,
          upvoted: p.upvoted,
          downvoted: p.downvoted,
          duration: p.duration,
          lowerBudget: p.lowerBudget,
          upperBudget: p.upperBudget,
          activities: p.activities,
          comments: p.comments,
          rated: p.rated,
          description: p.description || "",
        }));

        setPosts(formattedPosts);
        setSavedPosts(savedData.savedPosts || []);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    startSparkleAnimation();

    fetchPostsAndSaved();
  }, []);

  useEffect(() => {
    const updatedNonSaved = posts.filter((p) => !savedPosts.includes(p.id));
    setNonSavedPosts(updatedNonSaved);

    if (updatedNonSaved.length > 0) {
      const randomIndex = Math.floor(Math.random() * updatedNonSaved.length);
      setCurrentLocation(updatedNonSaved[randomIndex]);
    } else {
      setCurrentLocation(null);
    }
  }, [posts, savedPosts]);

  const startSparkleAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(sparkleAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(sparkleAnim, {
          toValue: 0,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const getRandomLocation = () => {
    if (nonSavedPosts.length === 0) {
      setCurrentLocation(null);
      return;
    }
    const randomIndex = Math.floor(Math.random() * nonSavedPosts.length);
    setCurrentLocation(nonSavedPosts[randomIndex]);
  };

  const handleCancel = () => {
    router.push("/");
  };

  const sparkleOpacity = sparkleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });

  if (!currentLocation) {
    return null; // or a loading spinner
  }

  return (
    <LinearGradient
      colors={["#E6F0FF", "#FFFFFF"]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Stack.Screen options={{ headerShown: false }} />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={handleCancel}>
          <Text style={styles.cancelButton}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Surprise Me</Text>
        <TouchableOpacity onPress={getRandomLocation}>
          <Text style={styles.doneButton}>Try Again</Text>
        </TouchableOpacity>
      </View>

      {/* Decorative Elements */}
      <View style={styles.decorativeContainer}>
        {/* Sparkles */}
        <Animated.View
          style={[styles.sparkle, styles.sparkle1, { opacity: sparkleOpacity }]}
        />
        <Animated.View
          style={[styles.sparkle, styles.sparkle2, { opacity: sparkleOpacity }]}
        />
        <Animated.View
          style={[styles.sparkle, styles.sparkle3, { opacity: sparkleOpacity }]}
        />
        <Animated.View
          style={[styles.sparkle, styles.sparkle4, { opacity: sparkleOpacity }]}
        />
        <Animated.View
          style={[styles.sparkle, styles.sparkle5, { opacity: sparkleOpacity }]}
        />

        {/* Stars */}
        <Feather name="star" size={60} color="#A9C0FF" style={styles.star1} />
        <Feather name="star" size={60} color="#A9C0FF" style={styles.star2} />
      </View>

      {/* Main Content */}
      <View style={styles.contentContainer}>
        <Text style={styles.headerText}>Your Next Adventure Awaits</Text>
        <Text style={styles.subHeaderText}>
          We've picked something special just for you
        </Text>

        {/* Location Card */}
        <TouchableOpacity
          style={styles.cardContainer}
          onPress={() =>
            handleCardPress(
              currentLocation.id,
              currentLocation.picture,
              currentLocation.title,
              currentLocation.username,
              currentLocation.city,
              currentLocation.bestTime,
              currentLocation.upvotes,
              currentLocation.upvoted,
              currentLocation.downvoted,
              currentLocation.duration,
              currentLocation.lowerBudget,
              currentLocation.upperBudget,
              currentLocation.activities,
              currentLocation.comments,
              currentLocation.saved,
              currentLocation.rating,
              currentLocation.description
            )
          }
          activeOpacity={0.8}
        >
          <Image
            source={{ uri: currentLocation.picture }}
            style={styles.cardImage}
          />
          <BlurView intensity={80} style={styles.cardOverlay}>
            <Text style={styles.locationTitle}>{currentLocation.title}</Text>
            <View style={styles.locationInfo}>
              <Feather name="map-pin" size={20} color="#CAC8C8" />
              <Text style={styles.locationText}>
                {currentLocation.location}
              </Text>
              <Text style={styles.rating}>{currentLocation.rating} ★</Text>
            </View>
            <Text style={styles.locationDescription}>
              {currentLocation.description}
            </Text>
          </BlurView>
        </TouchableOpacity>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={getRandomLocation}
          >
            <Feather name="refresh-cw" size={20} color="#386BF6" />
            <Text style={styles.nextButtonText}>Try Another</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  topBar: {
    height: 56,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 40,
  },
  cancelButton: {
    fontFamily: "Poppins",
    fontSize: 16,
    color: "#262626",
  },
  pageTitle: {
    fontFamily: "Poppins",
    fontSize: 18,
    fontWeight: "600",
    color: "#262626",
  },
  doneButton: {
    fontFamily: "Poppins",
    fontSize: 16,
    fontWeight: "600",
    color: "#386BF6",
  },
  decorativeContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: -1,
  },
  sparkle: {
    position: "absolute",
    width: 25,
    height: 16,
    backgroundColor: "#386BF6",
    borderRadius: 5,
    transform: [{ rotate: "45deg" }],
  },
  sparkle1: {
    top: "20%",
    left: "10%",
  },
  sparkle2: {
    bottom: "25%",
    right: "15%",
  },
  sparkle3: {
    top: "30%",
    right: "20%",
    backgroundColor: "#A9C0FF",
  },
  sparkle4: {
    bottom: "40%",
    left: "20%",
    backgroundColor: "#A9C0FF",
  },
  sparkle5: {
    top: "50%",
    right: "30%",
    backgroundColor: "#386BF6",
  },
  star1: {
    position: "absolute",
    top: "15%",
    right: "10%",
    opacity: 0.7,
  },
  star2: {
    position: "absolute",
    bottom: "20%",
    left: "10%",
    transform: [{ scaleX: -1 }],
    opacity: 0.7,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontFamily: "Poppins",
    fontSize: 24,
    fontWeight: "700",
    color: "#386BF6",
    marginBottom: 8,
    textAlign: "center",
  },
  subHeaderText: {
    fontFamily: "Poppins",
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  cardContainer: {
    width: width * 0.85,
    height: height * 0.5,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  cardOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  locationTitle: {
    fontFamily: "Poppins",
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 5,
  },
  locationInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  locationText: {
    fontFamily: "Poppins",
    fontSize: 16,
    color: "#FFFFFF",
    marginLeft: 5,
  },
  rating: {
    fontFamily: "Poppins",
    fontSize: 16,
    color: "#FFD700",
    marginLeft: "auto",
  },
  locationDescription: {
    fontFamily: "Poppins",
    fontSize: 14,
    color: "#FFFFFF",
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: width * 0.85,
    marginTop: 30,
  },
  likeButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#386BF6",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  nextButton: {
    flex: 1,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 50,
  },
  nextButtonText: {
    fontFamily: "Poppins",
    fontSize: 16,
    fontWeight: "600",
    color: "#386BF6",
    marginLeft: 10,
  },
});

export default SurprisePage;
