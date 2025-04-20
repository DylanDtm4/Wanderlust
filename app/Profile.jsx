import React, { useState, useEffect } from "react";
import { useRouter, Stack } from "expo-router";
import {
	View,
	Text,
	StyleSheet,
	Image,
	TouchableOpacity,
	ScrollView,
	Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import profile1 from "../assets/images/profile1.jpg";
import { getAuth } from "firebase/auth";
import { app } from "../config/firebase";
import gridPosts from "../assets/images/gridIcon.png";
import { ActivityIndicator } from "react-native";

const screenWidth = Dimensions.get("window").width;
const cardSize = (screenWidth - 40) / 3;

const Profile = () => {
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState();
	const [posts, setPosts] = useState([]);
	const [createdPosts, setCreatedPosts] = useState([]);
	const [imageLoaded, setImageLoaded] = useState({});
	const [loadingProfileImage, setLoadingProfileImage] = useState(true);

	const router = useRouter();

	const auth = getAuth(app);
	const currentUser = auth.currentUser;

	if (!currentUser) {
		console.log("No user is signed in.");
		return;
	}

	const userId = currentUser.uid;

	const handleAddCardPress = () => {
		router.push("/create");
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

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const usernameRes = await fetch(
					`https://wanderlustbackend-s12f.onrender.com/users/${userId}`
				);
				const userData = await usernameRes.json();
				setUser(userData);
			} catch (err) {
				console.error("User fetch error:", err);
			}
		};

		fetchUser();
	}, []);

	useEffect(() => {
		if (!user) return;

		const fetchPosts = async () => {
			try {
				const postsRes = await fetch(
					`https://wanderlustbackend-s12f.onrender.com/posts`
				);
				const postsData = await postsRes.json();

				const formattedPosts = postsData.map((p) => ({
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
				}));

				const userCreatedPosts = formattedPosts.filter(
					(post) => post.username === user.username
				);

				setPosts(formattedPosts);
				setCreatedPosts(userCreatedPosts);
			} catch (err) {
				console.error("Posts fetch error:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchPosts();
	}, [user]);

	const handleImageLoad = (id) => {
		setImageLoaded((prevState) => ({ ...prevState, [id]: true }));
	};

	const allImagesLoaded = createdPosts.every((post) => imageLoaded[post.id]);

	useEffect(() => {
		if (allImagesLoaded) {
			setLoading(false);
		}
	}, [allImagesLoaded]);

	return (
		<>
			<Stack.Screen
				options={{
					headerShown: false,
					statusBarAnimation: "slide",
					statusBarStyle: "dark",
				}}
			/>
			<View style={styles.container}>
				{!user || loading ? (
					<View style={styles.loadingContainer}>
						<ActivityIndicator size="large" color="#386BF6" />
					</View>
				) : (
					<>
						<View style={styles.username}>
							<Text style={styles.usernameText}>{user.username}</Text>
						</View>

						<View style={styles.topContainer}>
							<View style={styles.profileImageWrapper}>
								{loadingProfileImage && (
									<ActivityIndicator
										size="large"
										color="#386BF6"
										style={styles.loader}
									/>
								)}
								<Image
									source={profile1}
									style={styles.profileImage}
									onLoad={() => setLoadingProfileImage(false)}
								/>
							</View>
							<View style={styles.statsContainer}>
								{[
									{ label: "Posts", value: createdPosts.length },
									{ label: "Followers", value: user.friends.length },
									{ label: "Following", value: user.following.length },
								].map((item, idx) => (
									<View key={idx} style={styles.statItem}>
										<Text style={styles.statNumber}>{item.value}</Text>
										<Text style={styles.statLabel}>{item.label}</Text>
									</View>
								))}
							</View>
						</View>

						<View style={styles.profileInfo}>
							<View style={styles.nameBioContainer}>
								<Text style={styles.nameBold}>{user.username}</Text>
								<Text style={styles.bio}>{user.bio}</Text>
							</View>
							<TouchableOpacity
								style={styles.editButton}
								onPress={() => router.push("/EditProfileScreen")}
							>
								<Text style={styles.editButtonText}>Edit Profile</Text>
							</TouchableOpacity>
						</View>

						<View style={styles.gridIcon}>
							<Image source={gridPosts} style={styles.gridPosts} />
						</View>

						<View style={styles.solidLine} />

						<ScrollView contentContainerStyle={styles.gridContainer}>
							<View style={styles.gridRowWrap}>
								{createdPosts.map((post) => (
									<View key={post.id} style={styles.cardWrapper}>
										<Card
											image={{ uri: post.picture }}
											location={post.title}
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
											onLoad={() => handleImageLoad(post.id)}
										/>
									</View>
								))}
								<View style={styles.cardWrapper}>
									<TouchableOpacity
										style={styles.card}
										onPress={handleAddCardPress}
									>
										<View style={styles.addButton}>
											<Ionicons name="add-circle" size={40} color="#386BF6" />
											<Text style={styles.locationText}>Add Place</Text>
										</View>
									</TouchableOpacity>
								</View>
							</View>
						</ScrollView>
					</>
				)}
			</View>
		</>
	);
};

const Card = ({ image, location, onPress, onLoad }) => {
	const [loadingImage, setLoadingImage] = useState(true);

	const handleLoad = () => {
		setLoadingImage(false);
		onLoad?.();
	};

	return (
		<TouchableOpacity style={styles.card} onPress={onPress}>
			<View style={{ width: "100%", flex: 1 }}>
				<Image source={image} style={styles.image} onLoad={handleLoad} />
				{loadingImage && (
					<ActivityIndicator
						size="small"
						color="#386BF6"
						style={StyleSheet.absoluteFillObject}
					/>
				)}
			</View>
			<View style={styles.locationContainer}>
				<Text style={styles.locationText}>{location}</Text>
			</View>
		</TouchableOpacity>
	);
};

export default Profile;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
	},
	username: {
		alignItems: "center",
		marginVertical: 20,
	},
	usernameText: {
		fontFamily: "Poppins",
		fontSize: 16,
		fontWeight: "600",
		color: "#262626",
	},
	topContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginHorizontal: 20,
		marginTop: 25,
	},
	profileImage: {
		width: 100,
		height: 100,
		borderRadius: 50,
		borderWidth: 3,
		borderColor: "#C7C7CC",
	},
	statsContainer: {
		flexDirection: "row",
		justifyContent: "space-around",
		flex: 1,
		marginLeft: 20,
	},
	statItem: {
		alignItems: "center",
	},
	statNumber: {
		fontSize: 16,
		fontWeight: "bold",
		color: "#262626",
	},
	statLabel: {
		fontSize: 12,
		color: "#666",
	},
	profileInfo: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginHorizontal: 20,
		marginTop: 10,
	},
	nameBioContainer: {
		flex: 1,
	},
	nameBold: {
		fontSize: 14,
		fontWeight: "bold",
		color: "#262626",
		marginBottom: 4,
	},
	bio: {
		fontSize: 13,
		color: "#666",
	},
	editButton: {
		backgroundColor: "#f4f4f4",
		borderRadius: 8,
		paddingHorizontal: 15,
		paddingVertical: 6,
		marginLeft: 10,
		borderWidth: 1,
		borderColor: "#ccc",
	},
	editButtonText: {
		fontSize: 13,
		color: "#333",
	},
	gridIcon: {
		alignItems: "center",
		marginVertical: 10,
	},
	gridPosts: {
		width: 25,
		height: 25,
	},
	solidLine: {
		height: 1,
		backgroundColor: "#eee",
		marginHorizontal: 20,
		marginTop: 10,
	},
	gridContainer: {
		paddingHorizontal: 10,
		paddingBottom: 20,
		marginTop: 20,
	},
	row: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 15,
	},
	card: {
		width: cardSize,
		height: 120,
		backgroundColor: "#fff",
		borderRadius: 12,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
		overflow: "hidden",
		alignItems: "center",
	},
	image: {
		width: "100%",
		height: "100%",
		resizeMode: "cover",
	},
	locationText: {
		fontSize: 13,
		color: "#444",
		paddingTop: 5,
	},
	addButton: {
		justifyContent: "center",
		alignItems: "center",
	},
	gridRowWrap: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",
	},

	cardWrapper: {
		marginBottom: 15,
		width: cardSize,
	},
	loadingContainer: {
		position: "absolute",
		width: "100%",
		height: "100%",
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#1E1E1E",
		zIndex: 1,
	},
	profileImageWrapper: {
		position: "relative",
		width: 100, // Ensure width is consistent with the image size
		height: 100, // Ensure height is consistent with the image size
		borderRadius: 50, // For circular shape
		overflow: "hidden", // Make sure no overflow happens
	},
	loader: {
		position: "absolute",
		top: "50%", // Center vertically
		left: "50%", // Center horizontally
		transform: [{ translateX: -17.5 }, { translateY: -17.5 }], // Adjust for the loader size
	},
});
