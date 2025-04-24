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
  ActivityIndicator,
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
  const [savedPostIds, setSavedPostIds] = useState([]);
  const [currentPost, setCurrentPost] = useState(null);
  const [loadingImage, setLoadingImage] = useState(true);
  const [sparkleAnim] = useState(new Animated.Value(0));

  const auth = getAuth(app);
  const user = auth.currentUser;
  const router = useRouter();

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const [postsRes, userRes] = await Promise.all([
          fetch("https://wanderlustbackend-s12f.onrender.com/posts"),
          fetch(
            `https://wanderlustbackend-s12f.onrender.com/users/${user.uid}`
          ),
        ]);

        const postsData = await postsRes.json();
        const userData = await userRes.json();

        setPosts(postsData);
        setSavedPostIds(userData.savedPosts || []);
      } catch (err) {
        console.error("Failed to fetch posts or user:", err);
      }
    };

    fetchData();
    startSparkleAnimation();
  }, [user]);

  useEffect(() => {
    const nonSaved = posts.filter((p) => !savedPostIds.includes(p._id));
    if (nonSaved.length > 0) {
      const random = nonSaved[Math.floor(Math.random() * nonSaved.length)];
      setCurrentPost(random);
      setLoadingImage(true);
    } else {
      setCurrentPost(null);
    }
  }, [posts, savedPostIds]);

  const getRandomPost = () => {
    setCurrentPost(null);
    const nonSaved = posts.filter((p) => !savedPostIds.includes(p._id));
    if (nonSaved.length === 0) return;

    const random = nonSaved[Math.floor(Math.random() * nonSaved.length)];
    setCurrentPost(random);
    setLoadingImage(true);
  };

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

  const sparkleOpacity = sparkleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });

  const handlePostPress = () => {
    if (!currentPost) return;

    router.push({
      pathname: "/post",
      params: {
        ...currentPost,
        postID: currentPost._id,
      },
    });
  };

  if (!currentPost) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#386BF6" />
        <Text style={{ marginTop: 10, fontFamily: "Poppins" }}>
          Loading Surprise...
        </Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={["#E6F0FF", "#FFFFFF"]} style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.push("/")}>
          <Text style={styles.cancelButton}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Surprise Me</Text>
        <TouchableOpacity onPress={getRandomPost}>
          <Text style={styles.doneButton}>Try Again</Text>
        </TouchableOpacity>
      </View>

      {/* Decorative Sparkles */}
      <View style={styles.decorativeContainer}>
        {[
          styles.sparkle1,
          styles.sparkle2,
          styles.sparkle3,
          styles.sparkle4,
          styles.sparkle5,
        ].map((style, i) => (
          <Animated.View
            key={i}
            style={[styles.sparkle, style, { opacity: sparkleOpacity }]}
          />
        ))}
        <Feather name="star" size={60} color="#A9C0FF" style={styles.star1} />
        <Feather name="star" size={60} color="#A9C0FF" style={styles.star2} />
      </View>

      {/* Main Content */}
      <View style={styles.contentContainer}>
        <Text style={styles.headerText}>Your Next Adventure Awaits</Text>
        <Text style={styles.subHeaderText}>
          We've picked something special just for you
        </Text>

        {/* Post Card */}
        <TouchableOpacity
          style={styles.cardContainer}
          onPress={handlePostPress}
          activeOpacity={0.8}
        >
          {loadingImage && (
            <ActivityIndicator
              size="large"
              color="#386BF6"
              style={styles.loading}
            />
          )}
          <Image
            key={currentPost._id} // 🔑 Forces re-render when post changes
            source={{ uri: currentPost.picture }}
            style={styles.cardImage}
            onLoad={() => setLoadingImage(false)}
          />
          <BlurView intensity={80} style={styles.cardOverlay}>
            <Text style={styles.locationTitle}>{currentPost.title}</Text>
            <View style={styles.locationInfo}>
              <Feather name="map-pin" size={20} color="#CAC8C8" />
              <Text style={styles.locationText}>{currentPost.location}</Text>
              <Text style={styles.rating}>{currentPost.rating} ★</Text>
            </View>
            <Text style={styles.locationDescription}>
              {currentPost.description}
            </Text>
          </BlurView>
        </TouchableOpacity>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.nextButton} onPress={getRandomPost}>
            <Feather name="refresh-cw" size={20} color="#386BF6" />
            <Text style={styles.nextButtonText}>Try Another</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
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
    borderRadius: 5,
    backgroundColor: "#386BF6",
    transform: [{ rotate: "45deg" }],
  },
  sparkle1: { top: "20%", left: "10%" },
  sparkle2: { bottom: "25%", right: "15%" },
  sparkle3: { top: "30%", right: "20%", backgroundColor: "#A9C0FF" },
  sparkle4: { bottom: "40%", left: "20%", backgroundColor: "#A9C0FF" },
  sparkle5: { top: "50%", right: "30%", backgroundColor: "#386BF6" },
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
    width: width * 0.85,
    marginTop: 30,
  },
  nextButton: {
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
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
  loading: {
    position: "absolute",
    top: "50%",
    alignSelf: "center",
    zIndex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E6F0FF",
  },
});

export default SurprisePage;
