import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	StyleSheet,
	Image,
	TouchableOpacity,
	ScrollView,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Logo from "../assets/images/Logo2.png";
import { getAuth } from "firebase/auth";
import { app } from "../config/firebase";
import { ActivityIndicator } from "react-native";

const Saved = () => {
	const [loadingImages, setLoadingImages] = useState({});
	const [activeTab, setActiveTab] = useState("Location"); // State to track active tab
	const router = useRouter(); // Router for navigation
	const auth = getAuth(app);
	const currentUser = auth.currentUser;
	if (!currentUser) throw new Error("User not logged in");
	const userId = currentUser.uid;
	const [savedPosts, setSavedPosts] = useState([]);
	const [posts, setPosts] = useState([]);
	useEffect(() => {
		const fetchSavedPosts = async () => {
			if (!userId) return;

			try {
				const res = await fetch(
					`https://wanderlustbackend-s12f.onrender.com/users/${userId}`
				);
				const data = await res.json();
				if (data.savedPosts) {
					setSavedPosts(data.savedPosts || []);
				} else {
					console.error("No saved posts found");
				}
			} catch (err) {
				console.error("Fetch error:", err);
			}
		};
		const fetchPostsByID = async () => {
			if (savedPosts.length === 0) return; // If no saved posts, return

			try {
				// Fetch data for each saved post using its postID
				const postData = await Promise.all(
					savedPosts.map(async (postID) => {
						const res = await fetch(
							`https://wanderlustbackend-s12f.onrender.com/posts/${postID}`
						);
						const data = await res.json();
						return {
							id: data._id,
							username: data.username,
							title: data.title,
							location: data.location,
							city: data.city,
							rating: data.rating,
							picture: data.picture,
							saved: data.saved,
							bestTime: data.bestTime,
							upvotes: data.upvotes,
							upvoted: data.upvoted,
							downvoted: data.downvoted,
							duration: data.duration,
							lowerBudget: data.lowerBudget,
							upperBudget: data.upperBudget,
							activities: data.activities,
							comments: data.comments,
							rated: data.rated,
							title: data.title,
							description: data.description,
							itinerary: data.itinerary,
						};
					})
				);
				setPosts(postData);
			} catch (err) {
				console.error("Fetch error:", err);
			}
		};
		fetchSavedPosts();
		fetchPostsByID();
	}, [posts, savedPosts]);
	// Function to handle item click
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

	return (
		<>
			<Stack.Screen options={{ headerShown: false }} />
			<View style={styles.container}>
				{/* Logo at the top right */}
				<Image source={Logo} style={styles.logo} resizeMode="contain" />
				{/* Header */}
				<View style={styles.header}>
					<Text style={styles.wanderlustText}>Wanderlust</Text>
					<Text style={styles.savedText}>Saved</Text>
				</View>

				{/* Category Tabs */}
				<View style={styles.categoryContainer}>
					{["Location", "Hotels", "Food", "Adventure"].map((tab) => (
						<TouchableOpacity
							key={tab}
							style={[
								styles.categoryTab,
								activeTab === tab && styles.activeTab,
							]}
							onPress={() => setActiveTab(tab)}
						>
							<Text
								style={[
									styles.categoryText,
									activeTab === tab && styles.activeCategoryText,
								]}
							>
								{tab}
							</Text>
						</TouchableOpacity>
					))}
				</View>

				{/* Saved Items */}
				<ScrollView style={styles.savedItemsContainer}>
					{posts.map((post) => (
						<TouchableOpacity
							key={post.id}
							style={styles.savedItem}
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
							<View style={{ position: "relative", width: 51, height: 56 }}>
								{loadingImages[post.id] && (
									<View style={styles.imageLoader}>
										<ActivityIndicator size="small" color="#386BF6" />
									</View>
								)}
								<Image
									source={{ uri: post.picture }}
									style={styles.itemImage}
									onLoadStart={() =>
										setLoadingImages((prev) => ({ ...prev, [post.id]: true }))
									}
									onLoadEnd={() =>
										setLoadingImages((prev) => ({ ...prev, [post.id]: false }))
									}
								/>
							</View>
							<View style={styles.itemInfo}>
								<Text style={styles.itemTitle}>{post.title}</Text>
								<Text style={styles.itemDate}>{post.bestTime}</Text>
							</View>
							<Ionicons name="chevron-forward" size={24} color="#425884" />
						</TouchableOpacity>
					))}
				</ScrollView>
			</View>
		</>
	);
};

export default Saved;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FFFFFF",
	},
	logo: {
		position: "absolute",
		top: 60,
		right: 20,
		width: 100, // Adjust the size as needed
		height: 100, // Adjust the size as needed
	},
	header: {
		padding: 30,
		paddingTop: 100,
		marginBottom: 5,
	},
	wanderlustText: {
		fontFamily: "Poppins",
		fontSize: 32,
		fontWeight: "400",
		color: "#000000",
		letterSpacing: -0.01,
	},
	savedText: {
		fontFamily: "Poppins",
		fontSize: 18,
		fontWeight: "700",
		color: "#386BF6",
		marginTop: 10,
	},
	categoryContainer: {
		flexDirection: "row",
		paddingHorizontal: 20,
		gap: 28,
		marginTop: 20,
	},
	categoryTab: {
		paddingVertical: 12,
		paddingHorizontal: 16,
		borderRadius: 33,
	},
	activeTab: {
		backgroundColor: "#386BF6",
	},
	categoryText: {
		fontFamily: "Actor",
		fontSize: 14,
		color: "black",
	},
	activeCategoryText: {
		color: "#FFFFFF",
	},
	savedItemsContainer: {
		flex: 1,
		padding: 20,
	},
	savedItem: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#FFFFFF",
		borderRadius: 10,
		padding: 12,
		marginBottom: 20,
		shadowColor: "rgba(66, 88, 132, 0.1)",
		shadowOffset: {
			width: 0,
			height: -4,
		},
		shadowOpacity: 1,
		shadowRadius: 25,
		elevation: 5,
	},
	itemImage: {
		width: 51,
		height: 56,
		borderRadius: 7,
		backgroundColor: "#E6E6E6",
	},
	itemInfo: {
		flex: 1,
		marginLeft: 14,
	},
	itemTitle: {
		fontFamily: "Poppins",
		fontSize: 18,
		fontWeight: "600",
		color: "#767676",
	},
	itemDate: {
		fontFamily: "Actor",
		fontSize: 8,
		color: "rgba(66, 88, 132, 0.5)",
		marginTop: 2,
	},
	imageLoader: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "rgba(255,255,255,0.6)",
		borderRadius: 7,
		zIndex: 1,
	},
});
