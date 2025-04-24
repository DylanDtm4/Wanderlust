import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import Icon from "react-native-vector-icons/Feather";
import { Feather } from "@expo/vector-icons";
import Logo from "../assets/images/Logo2.png";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { getAuth } from "firebase/auth";
import { app } from "../config/firebase";
import { ActivityIndicator } from "react-native";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [activeComment, setActiveComment] = useState(null);
  const [savedPosts, setSavedPosts] = useState([]);
  const [savedBg, setsavedBg] = useState({});
  const [user, setUser] = useState();
  const [imageLoading, setImageLoading] = useState({});

  const auth = getAuth(app);
  const currentUser = auth.currentUser;

  if (!currentUser) {
    console.log("No user is signed in.");
    return;
  }

  const userId = currentUser.uid;

  const handleSurprise = () => {
    router.push("surprise");
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
  const handleChatbotPress = () => {
    router.push("/chatbot");
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
        setUser(data.username);
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
  }, [posts, savedPosts]);

  const filteredPosts = posts.filter(
    (post) =>
      post.username !== user && // Ensure the post's username isn't the current user's
      (post.title.toLowerCase().includes(searchQuery.toLowerCase()) || // Title matches search query
        post.city.toLowerCase().includes(searchQuery.toLowerCase())) // City matches search query
  );

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      {/* Logo at the top right */}
      <Image source={Logo} style={styles.logo} resizeMode="contain" />
      {/*Chatbot Icon*/}
      <TouchableOpacity
        style={styles.botContainer}
        onPress={handleChatbotPress}
      >
        <FontAwesome5 name="robot" style={styles.bot} />
      </TouchableOpacity>

      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Wanderlust</Text>
            <Text style={styles.subtitle}>Find your next adventure</Text>
          </View>
          <TouchableOpacity style={styles.surpriseMe} onPress={handleSurprise}>
            <Icon name="shuffle" size={15} color="#000" />
            <Text style={styles.surpriseMeText}>Surprise Me</Text>
          </TouchableOpacity>
        </View>

        {/* Search bar */}
        <View style={styles.searchBar}>
          <Icon name="search" size={20} color="#CFCAC0" />
          <TextInput
            placeholder="Find things to do"
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
            style={styles.searchInput}
          />
        </View>
      </View>

      {/* Content Section */}
      <View style={styles.content}>
        <Text style={styles.popularPlaces}>Popular places</Text>

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryContainer}
          contentContainerStyle={styles.categoryContent}
        >
          <TouchableOpacity style={styles.categoryButton}>
            <Text style={styles.categoryText}>Recommended</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryButton}>
            <Text style={styles.categoryText}>Most viewed</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryButton}>
            <Text style={styles.categoryText}>Nearby</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryButton}>
            <Text style={styles.categoryText}>Latest</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Explore section */}
        <View style={styles.exploreSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {filteredPosts.map((post) => (
              <TouchableOpacity
                key={post.id}
                style={styles.exploreCard}
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
                {/* Image + Spinner */}
                <View style={{ flex: 1 }}>
                  <Image
                    source={{ uri: post.picture }}
                    style={styles.image}
                    resizeMode="cover"
                    onLoadStart={() =>
                      setImageLoading((prev) => ({ ...prev, [post.id]: true }))
                    }
                    onLoadEnd={() =>
                      setImageLoading((prev) => ({ ...prev, [post.id]: false }))
                    }
                  />
                  {imageLoading[post.id] && (
                    <View style={styles.loadingOverlay}>
                      <ActivityIndicator size="large" color="#FFFFFF" />
                    </View>
                  )}
                </View>

                <TouchableOpacity
                  style={[
                    styles.heartButton,
                    {
                      backgroundColor: savedPosts.includes(post.id)
                        ? "#386BF6"
                        : "rgba(255, 255, 255, 0.1)",
                    }, // Change background color
                  ]}
                  onPress={() => {
                    console.log(savedPosts.includes(post.id));
                    savedPosts.includes(post.id)
                      ? handleUnsave(post.id)
                      : handleSave(post.id);
                  }}
                >
                  <Feather
                    name="bookmark"
                    size={24}
                    color="white" // Change color dynamically
                  />
                </TouchableOpacity>

                <View style={styles.cardContent}>
                  <Text style={styles.locationText}>{post.title}</Text>
                  <View style={styles.cardFooter}>
                    <Text style={styles.cityText}>{post.city}</Text>
                    <Text style={styles.rating}>{post.rating} ★</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: 20,
  },
  logo: {
    position: "absolute",
    top: 30,
    right: 20,
    width: 60,
    height: 60,
  },

  botContainer: {
    position: "absolute",
    bottom: 29,
    left: 5,
    backgroundColor: "#386BF6",
    borderRadius: 100,
    padding: 15,
    shadowColor: "#000", // Shadow for a floating effect
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4.84,
    elevation: 20,
    zIndex: 1, //ensures the bot is shown ontop
  },
  bot: {
    color: "#FFFFFF",
    fontSize: 24,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 40,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontFamily: "Poppins",
    fontSize: 35,
    fontWeight: "800",
    color: "#000000",
  },
  subtitle: {
    fontFamily: "Actor",
    fontSize: 15,
    fontWeight: "400",
    color: "#8db9f2",
    marginTop: 5,
    fontWeight: "500",
  },

  surpriseMe: {
    backgroundColor: "rgba(29, 29, 29, 0.4)",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    display: "flex",
    borderRadius: 100,
    padding: 14,
    marginLeft: 20,
    top: 50,
    backgroundColor: "#386BF6",
    borderRadius: 33,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  surpriseMeText: {
    fontFamily: "Actor",
    fontSize: 12,
    fontWeight: "400",
    color: "#FFFFFF",
  },
  searchBar: {
    backgroundColor: "#F3F8FE",
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    fontFamily: "Poppins",
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
    marginLeft: 10,
  },
  content: {
    paddingHorizontal: 20,
  },
  popularPlaces: {
    fontFamily: "Poppins",
    fontSize: 20,
    fontWeight: "600",
    color: "#2F2F2F",
    marginBottom: 16,
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryContent: {
    paddingRight: 20,
    gap: 10,
  },
  categoryButton: {
    backgroundColor: "#386BF6",
    borderRadius: 33,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginRight: 10,
  },
  categoryText: {
    fontFamily: "Actor",
    fontSize: 14,
    color: "#FFFFFF",
  },
  exploreSection: {
    marginBottom: 20,
  },
  horizontalScroll: {
    paddingHorizontal: 20,
    gap: 20,
  },
  exploreCard: {
    width: 350,
    height: 450,
    borderRadius: 25,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    marginBottom: 20,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    marginRight: 20,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  heartButton: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    padding: 12,
    borderRadius: 25,
    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 25,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    backdropFilter: "blur(10px)",
  },
  locationText: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cityText: {
    color: "#FFFFFF",
    fontSize: 18,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  rating: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "#1E1E1E",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
});

export default Home;
