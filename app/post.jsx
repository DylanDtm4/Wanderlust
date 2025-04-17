import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	ImageBackground,
	Dimensions,
	Image,
	Animated,
	ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, Stack, useRouter } from "expo-router";
import { BlurView } from "expo-blur";
import { getAuth } from "firebase/auth";
import { app } from "../config/firebase";
const { width, height } = Dimensions.get("window");

const Post = () => {
	const {
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
		// comments,
		saved,
		rating,
		rated,
	} = useLocalSearchParams();
	/* comments layout {
    text: "Have a nice day bro",
    username: "TravelLover123",
    avatar: require("../assets/images/profile1.jpg"),
  } */
	const comments = [
		{
			text: "Have a nice day bro",
			username: "TravelLover123",
			avatar: require("../assets/images/profile1.jpg"),
		},
		{
			text: "Wow this Trip sounds fun",
			username: "AdventureSeeker",
			avatar: require("../assets/images/profile2.jpg"),
		},
		{
			text: "Wow this is amazing",
			username: "Wanderer22",
			avatar: require("../assets/images/profile3.jpg"),
		},
	];
	const [isSaved, setIsSaved] = useState(saved === "true");
	const [savedPosts, setSavedPosts] = useState([]);
	const [hasUpvoted, setHasUpvoted] = useState(upvoted === "true");
	const [hasDownvoted, setHasDownvoted] = useState(downvoted === "true");

	const [votes, setVotes] = useState(upvotes);
	const [currentCommentIndex, setCurrentCommentIndex] = useState(0);
	const [showAllComments, setShowAllComments] = useState(false);
	const [fadeAnim] = useState(new Animated.Value(1));
	const [slideAnim] = useState(new Animated.Value(0));
	const auth = getAuth(app);
	const currentUser = auth.currentUser;
	if (!currentUser) throw new Error("User not logged in");
	const userId = currentUser.uid;

	const handleSave = async (postID) => {
		try {
			const res = await fetch(
				`https://mint-adder-awake.ngrok-free.app/users/${userId}/save-post`,
				{
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ postID }),
				}
			);

			const data = await res.json();
			console.log("Save response:", data);

			if (data.success) {
				setIsSaved(true); // Update UI
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
				`https://mint-adder-awake.ngrok-free.app/users/${userId}/remove-saved-post`,
				{
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ postID }),
				}
			);

			const data = await res.json();
			console.log("Unsave response:", data);

			if (data.success) {
				setIsSaved(false); // Update UI
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
		const fetchSavedPosts = async () => {
			if (!userId) return;

			try {
				const res = await fetch(
					`https://mint-adder-awake.ngrok-free.app/users/${userId}`
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

		const interval = setInterval(() => {
			Animated.timing(fadeAnim, {
				toValue: 0,
				duration: 500,
				useNativeDriver: true,
			}).start(() => {
				setCurrentCommentIndex(
					(prevIndex) => (prevIndex + 1) % comments.length
				);
				Animated.timing(fadeAnim, {
					toValue: 1,
					duration: 500,
					useNativeDriver: true,
				}).start();
			});
		}, 5000);

		fetchSavedPosts();

		return () => clearInterval(interval);
	}, []);

	const handleUpVote = async () => {
		if (hasUpvoted) {
			setHasUpvoted(false);
			setVotes((prev) => prev - 1);
		} else {
			setVotes((prev) => prev + (hasDownvoted ? 2 : 1));
			setHasUpvoted(true);
		}
		try {
			await fetch(
				`https://mint-adder-awake.ngrok-free.app/posts/upvote/${postID}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						upvotes: votes,
						upvoted: hasUpvoted,
					}),
				}
			);
		} catch (err) {
			console.error("Failed to upvote:", err);
		}
	};

	const handleDownVote = async () => {
		if (hasDownvoted) {
			setVotes((prev) => prev + 1);
			setHasDownvoted(false);
		} else {
			setVotes((prev) => prev - (hasUpvoted ? 2 : 1));
			setHasUpvoted(false);
			setHasDownvoted(true);
		}
		try {
			await fetch(
				`https://mint-adder-awake.ngrok-free.app/posts/downvote/${postID}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						upvotes: votes,
						downvoted: hasDownvoted,
					}),
				}
			);
		} catch (err) {
			console.error("Failed to downvote:", err);
		}
	};

	const handleMessage = () => {
		router.push("/messages");
	};
	const handleFriends = () => {
		router.push("/friends");
	};

	const toggleComments = () => {
		if (showAllComments) {
			Animated.timing(slideAnim, {
				toValue: 0,
				duration: 300,
				useNativeDriver: true,
			}).start(() => setShowAllComments(false));
		} else {
			setShowAllComments(true);
			Animated.timing(slideAnim, {
				toValue: 1,
				duration: 300,
				useNativeDriver: true,
			}).start();
		}
	};
	const router = useRouter();
	const handleExplore = () => {
		router.push({
			pathname: "/Itinerary",
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
			},
		});
	};

	const renderComment = (comment, index) => (
		<View key={index} style={styles.comment}>
			<Image style={styles.commentAvatar} source={comment.avatar} />
			<View style={styles.commentContent}>
				<Text style={styles.commentUsername}>{comment.username}</Text>
				<Text style={styles.commentText}>{comment.text}</Text>
			</View>
		</View>
	);

	return (
		<>
			<Stack.Screen options={{ headerShown: false }} />
			<View style={styles.container}>
				<ImageBackground
					source={{ uri: picture }}
					style={styles.backgroundImage}
					resizeMode="cover"
				>
					{/* Blur Overlay */}
					<View style={styles.blurOverlay} />

					{/* Top Section */}
					<View style={styles.topSection}>
						{/* Rating Section */}
						<View style={styles.ratingSection}>
							<View style={styles.starContainer}>
								<Feather name="star" size={25} color="gold" />
								<Text style={styles.rating}>{rating}</Text>
							</View>
						</View>

						{/* Save Button */}
						<TouchableOpacity
							style={[
								styles.savedButton,
								{
									backgroundColor: isSaved
										? "#386BF6"
										: "rgba(255, 255, 255, 0.1)",
								},
							]}
							onPress={() => {
								isSaved ? handleUnsave(postID) : handleSave(postID);
							}}
						>
							<Feather name="bookmark" size={24} color="#FFFFFF" />
						</TouchableOpacity>
					</View>

					{/* Content Container */}
					<View style={styles.contentContainer}>
						{/* username Info */}
						<View style={styles.usernameInfo}>
							<Text style={styles.byText}>By: {username}</Text>
							<Text style={styles.locationTitle}>{location}</Text>
						</View>

						{/* Location Info */}
						<View style={styles.locationInfo}>
							<Feather name="map-pin" size={24} color="#386BF6" />
							<Text style={styles.locationText}>{city}</Text>
						</View>

						{/* Voting Buttons */}
						<View style={styles.votingSection}>
							<TouchableOpacity style={styles.voteButton}>
								<Feather
									name="arrow-up"
									size={24}
									color="#386BF6"
									onPress={handleUpVote}
								/>
							</TouchableOpacity>
							<Text style={styles.voteCount}>{votes}</Text>
							<TouchableOpacity style={styles.voteButton}>
								<Feather
									name="arrow-down"
									size={24}
									color="#386BF6"
									onPress={handleDownVote}
								/>
							</TouchableOpacity>
						</View>

						{/* Common Info */}
						<View style={styles.commonInfo}>
							<View style={styles.infoField}>
								<Text style={styles.fieldLabel}>Best Time</Text>
								<Text style={styles.fieldValue}>{bestTime}</Text>
							</View>
							<View style={styles.infoField}>
								<Text style={styles.fieldLabel}>Duration</Text>
								<Text style={styles.fieldValue}>{duration}</Text>
							</View>
							<View style={styles.infoField}>
								<Text style={styles.fieldLabel}>Budget</Text>
								<Text style={styles.fieldValue}>
									${lowerBudget}-${upperBudget}
								</Text>
							</View>
							<View style={styles.infoField}>
								<Text style={styles.fieldLabel}>Activities</Text>
								<Text style={styles.fieldValue}>{activities}</Text>
							</View>
						</View>

						{/* Action Buttons */}
						<View style={styles.actionButtons}>
							<TouchableOpacity
								style={styles.actionButton}
								onPress={handleFriends}
							>
								<Text style={styles.actionButtonText}>Find Friends</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.actionButton}
								onPress={handleMessage}
							>
								<Text style={styles.actionButtonText}>Message</Text>
							</TouchableOpacity>
						</View>

						{/* Comments Section */}
						<TouchableOpacity onPress={toggleComments}>
							<View style={styles.commentsSection}>
								<View style={styles.commentHeader}>
									<Text style={styles.commentsTitle}>Comments</Text>
									<Text style={styles.commentCount}>3.2k</Text>
								</View>

								{!showAllComments ? (
									<Animated.View style={{ opacity: fadeAnim }}>
										{renderComment(comments[currentCommentIndex], 0)}
									</Animated.View>
								) : (
									<Animated.View
										style={{
											opacity: slideAnim,
											transform: [
												{
													translateY: slideAnim.interpolate({
														inputRange: [0, 1],
														outputRange: [20, 0],
													}),
												},
											],
										}}
									>
										{comments.map((comment, index) =>
											renderComment(comment, index)
										)}
										<View style={styles.viewMoreContainer}>
											<Text style={styles.viewMoreText}>
												View all 3.2k comments
											</Text>
											<Feather name="chevron-down" size={16} color="#FFFFFF" />
										</View>
									</Animated.View>
								)}
							</View>
						</TouchableOpacity>

						{/* BOOK SECTION */}
						<TouchableOpacity onPress={handleExplore}>
							<View style={styles.bookContainer}>
								<Text style={styles.bookButton}>Explore!</Text>
								<View style={styles.bookButtonIcon}>
									<Feather name="arrow-right" size={20} color="#386BF6" />
								</View>
							</View>
						</TouchableOpacity>
					</View>
				</ImageBackground>
			</View>
		</>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#1E1E1E",
	},
	backgroundImage: {
		width: width,
		height: height,
	},
	blurOverlay: {
		position: "absolute",
		width: "100%",
		height: "100%",
		backgroundColor: "#1E1E1E",
		opacity: 0.7,
	},
	topSection: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 28,
		paddingTop: 67,
		marginBottom: 10,
	},
	contentContainer: {
		flex: 1,
		paddingHorizontal: 16,
		paddingTop: 3,
	},
	savedButton: {
		width: 40,
		height: 40,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(255, 255, 255, 0.3)",
		borderRadius: 20,
	},
	ratingSection: {
		height: 40,
		justifyContent: "center",
	},
	starContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	rating: {
		fontFamily: "Poppins",
		fontSize: 20,
		fontWeight: "700",
		color: "#FFFFFF",
	},
	usernameInfo: {
		marginTop: 45,
		marginBottom: 12,
	},
	byText: {
		fontFamily: "Montserrat",
		fontSize: 14,
		color: "#FFFFFF",
		opacity: 0.7,
		marginBottom: 4,
	},
	locationTitle: {
		fontFamily: "Montserrat",
		fontSize: 32,
		fontWeight: "500",
		color: "#FFFFFF",
	},
	locationInfo: {
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
		marginBottom: 16,
	},
	locationText: {
		fontFamily: "Actor",
		fontSize: 16,
		fontStyle: "bold",
		color: "white",
		fontWeight: 400,
	},
	votingSection: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
		alignSelf: "flex-end",
		marginBottom: 20,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		padding: 8,
		borderRadius: 20,
	},
	voteButton: {
		width: 40,
		height: 40,
		justifyContent: "center",
		alignItems: "center",
	},
	voteCount: {
		fontFamily: "Actor",
		fontSize: 16,
		color: "white",
		fontWeight: "bold",
		marginHorizontal: 4,
	},
	commonInfo: {
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		borderRadius: 16,
		padding: 16,
		marginBottom: 20,
	},
	infoField: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 12,
	},
	fieldLabel: {
		fontFamily: "Poppins",
		fontSize: 15,
		fontWeight: "600",
		color: "#FFFFFF",
	},
	fieldValue: {
		fontFamily: "Poppins",
		fontSize: 13,
		color: "#FFFFFF",
		opacity: 0.8,
	},
	actionButtons: {
		flexDirection: "row",
		justifyContent: "center",
		gap: 20,
		marginBottom: 16,
	},
	actionButton: {
		backgroundColor: "#386BF6",
		borderRadius: 100,
		paddingVertical: 10,
		paddingHorizontal: 20,
		minWidth: 110,
		alignItems: "center",
	},
	actionButtonText: {
		fontFamily: "Poppins",
		fontSize: 14,
		fontWeight: "700",
		color: "#FFFFFF",
	},
	commentsSection: {
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		borderRadius: 12,
		padding: 12,
		marginBottom: 20,
	},
	commentHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 8,
	},
	commentsTitle: {
		fontFamily: "Poppins",
		fontSize: 12,
		fontWeight: "600",
		color: "#FFFFFF",
	},
	commentCount: {
		fontFamily: "Actor",
		fontSize: 13,
		color: "#FFFFFF",
	},
	comment: {
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
		marginBottom: 15,
	},
	commentContent: {
		flex: 1,
	},
	commentUsername: {
		fontFamily: "Poppins",
		fontSize: 12,
		fontWeight: "600",
		color: "#FFFFFF",
		marginBottom: 2,
	},
	commentText: {
		fontFamily: "Actor",
		fontSize: 12,
		color: "#FFFFFF",
	},
	commentAvatar: {
		width: 28,
		height: 28,
		borderRadius: 14,
		backgroundColor: "#C7C7CC",
		resizeMode: "cover",
	},
	viewMoreContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		marginTop: 8,
	},
	viewMoreText: {
		fontFamily: "Poppins",
		fontSize: 12,
		color: "#FFFFFF",
		marginRight: 4,
	},
	bookContainer: {
		flexDirection: "row",
		alignSelf: "center",
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "white",
		padding: 20,
		width: "80%",
		borderRadius: 50,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 4.84,
		elevation: 20,
		marginBottom: 30,
	},
	bookButton: {
		fontFamily: "Poppins",
		fontSize: 16,
		fontWeight: "700",
		color: "#386BF6",
		marginRight: 8,
	},
	bookButtonIcon: {
		backgroundColor: "rgba(56, 107, 246, 0.1)",
		width: 24,
		height: 24,
		borderRadius: 12,
		justifyContent: "center",
		alignItems: "center",
	},
});

export default Post;
