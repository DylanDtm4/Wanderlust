import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { Stack } from "expo-router";
import MapView from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getAuth } from "firebase/auth";
import { app } from "../config/firebase";

const { width } = Dimensions.get("window");
const SPOT_CARD_WIDTH = width * 0.65;

const Explore = () => {
  const [activeTab, setActiveTab] = useState("Location");
  const [isMapFullScreen, setIsMapFullScreen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);

  const auth = getAuth(app);
  const currentUser = auth.currentUser;

  if (!currentUser) {
    console.log("No user is signed in.");
    return;
  }

  const userId = currentUser.uid;
  const router = useRouter();

  const handleSeeAll = () => {
    router.push("/spots");
  };
  const categories = [
    { id: "Location", icon: "location" },
    { id: "Hotels", icon: "bed" },
    { id: "Food", icon: "restaurant" },
    { id: "Adventure", icon: "bicycle" },
  ];

  const handleTabClick = (category) => {
    setActiveTab(category);
  };

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
            };
          })
        );
        setPosts(displayPosts);
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
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.exploreText}>Explore</Text>
            <Text style={styles.aspenText}>Aspen</Text>
          </View>

          <View style={styles.locationContainer}>
            <Ionicons name="location" size={18} color="#386BF6" />
            <Text style={styles.locationText}>Aspen, USA</Text>
          </View>
        </View>

        {/* Search Bar 
        <TouchableOpacity style={styles.searchBar} activeOpacity={0.8}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <Text style={styles.searchText}>Find things to do</Text>
        </TouchableOpacity>
        */}

        {/* Category Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryContainer}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.tabItem,
                activeTab === category.id && styles.tabItemActive,
              ]}
              onPress={() => handleTabClick(category.id)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={category.icon}
                size={20}
                color={activeTab === category.id ? "#fff" : "#386BF6"}
                style={styles.tabIcon}
              />
              <Text
                style={[
                  styles.tabText,
                  activeTab === category.id && styles.tabTextActive,
                ]}
              >
                {category.id}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Map */}

        <View
          style={[styles.mapContainer, isMapFullScreen && styles.fullScreenMap]}
        >
          <TouchableOpacity
            style={styles.mapTouchable}
            activeOpacity={1}
            onPress={() => setIsMapFullScreen(!isMapFullScreen)}
          >
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: 40.758896,
                longitude: -73.98513,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            />
          </TouchableOpacity>
        </View>

        {/* Spots Carousel */}
        <View style={styles.spotsTitleContainer}>
          <Text style={styles.spotsTitle}>
            Popular {activeTab.toLowerCase()}
          </Text>
          <TouchableOpacity
            style={styles.seeAllButton}
            activeOpacity={0.8}
            onPress={handleSeeAll}
          >
            <Text style={styles.seeAllText}>See all</Text>
            <Ionicons name="chevron-forward" size={16} color="#386BF6" />
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.spotsContainer}
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
                  post.title,
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
                  post.description
                )
              }
            >
              <Image
                source={{ uri: post.picture }}
                style={styles.spotImage}
                resizeMode="cover"
              />
              <View style={styles.spotOverlay} />

              <View style={styles.spotContent}>
                <View style={styles.spotHeader}>
                  <Text style={styles.spotName} numberOfLines={2}>
                    {post.title}
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.saveButton,
                      {
                        backgroundColor: savedPosts.includes(post.id)
                          ? "#386BF6"
                          : "rgba(255, 255, 255, 0.1)",
                      },
                    ]}
                    activeOpacity={0.8}
                    onPress={() => {
                      savedPosts.includes(post.id)
                        ? handleUnsave(post.id)
                        : handleSave(post.id);
                    }}
                  >
                    <Ionicons name="bookmark" size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>

                <View style={styles.spotDetails}>
                  <Ionicons name="location" size={16} color="#FFFFFF" />
                  <Text style={styles.spotLocation}>{post.location}</Text>
                </View>

                <View style={styles.spotFooter}>
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={16} color="#FFD700" />
                    <Text style={styles.ratingText}>{post.rating}</Text>
                  </View>
                  <Text style={styles.priceText}>
                    ${post.lowerBudget}-{post.upperBudget}
                  </Text>
                </View>
              </View>
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
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingTop: 10,
  },
  headerLeft: {
    flex: 1,
  },
  exploreText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1E1E1E",
    marginBottom: 4,
  },
  aspenText: {
    fontSize: 32,
    fontWeight: "700",
    color: "#386BF6",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  locationText: {
    fontSize: 14,
    color: "#1E1E1E",
    fontWeight: "500",
    marginLeft: 6,
  },
  locationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#386BF6",
    marginRight: 6,
  },
  locationText: {
    fontSize: 15,
    color: "black",
    fontWeight: "500",
  },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  categoryContainer: {
    paddingBottom: 20,
    paddingRight: 20,
  },
  tabItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 100,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "#F5F7FA",
    marginRight: 10,
  },
  tabItemActive: {
    backgroundColor: "#386BF6",
  },
  tabIcon: {
    marginRight: 8,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#386BF6",
  },
  tabTextActive: {
    color: "#FFFFFF",
  },
  mapContainer: {
    height: 300,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 10,
    backgroundColor: "#E2E3E6",
  },
  fullScreenMap: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: "100%",
    borderRadius: 0,
    zIndex: 100,
  },
  mapTouchable: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  spotsTitleContainer: {
    top: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  spotsTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1E1E1E",
  },
  seeAllText: {
    fontSize: 14,
    color: "#386BF6",
    fontWeight: "500",
    marginRight: 5,
  },
  spotsContainer: {

    paddingBottom: 120,
    
  },
  spotCard: {
    width: SPOT_CARD_WIDTH,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    marginRight: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  spotImage: {
    width: "100%",
    height: 237,
  },
  spotOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  spotContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
  },
  spotHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  spotName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
    flex: 1,
    marginRight: 10,
  },
  spotDetails: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  spotLocation: {
    fontSize: 14,
    color: "#FFFFFF",
    marginLeft: 5,
  },
  spotFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    marginLeft: 5,
  },
  priceText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  saveButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    padding: 5,
  },
});

export default Explore;
