import React from "react";
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
import fuji from "../assets/images/fuji.png";
import paris from "../assets/images/paris.png";
import profile6 from "../assets/images/profile6.jpg";
import profile7 from "../assets/images/profile7.webp";
import profile4 from "../assets/images/profile4.webp";
import gridPosts from "../assets/images/gridIcon.png";

const screenWidth = Dimensions.get("window").width;
const cardSize = (screenWidth - 30) / 2;

const Profile = () => {
	const router = useRouter();

	const handleAddCardPress = () => {
		router.push("/create");
	};

	return (
		<>
			<Stack.Screen options={{ headerShown: false }} />
			<View style={styles.container}>
				<View style={styles.username}>
					<Text style={styles.usernameText}>john_doe</Text>
				</View>

				<View style={styles.topContainer}>
					<Image source={profile1} style={styles.profileImage} />
					<View style={styles.statsContainer}>
						{[
							{ label: "Posts", value: 54 },
							{ label: "Followers", value: 834 },
							{ label: "Following", value: 162 },
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
						<Text style={styles.nameBold}>John Doe</Text>
						<Text style={styles.bio}>Travel blogs in Texas</Text>
						<Text style={styles.bio}>Follow me for an adventure</Text>
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
					<View style={styles.row}>
						<Card image={fuji} location="Fuji, Tokyo" />
						<Card image={profile6} location="Aspen, CO" />
					</View>
					<View style={styles.row}>
						<Card image={profile7} location="Toronto, ON" />
						<Card image={paris} location="Paris, France" />
					</View>
					<View style={styles.row}>
						<Card image={profile4} location="Beijing, China" />
						<TouchableOpacity style={styles.card} onPress={handleAddCardPress}>
							<View style={styles.addButton}>
								<Ionicons name="add-circle" size={40} color="#386BF6" />
								<Text style={styles.locationText}>Add Place</Text>
							</View>
						</TouchableOpacity>
					</View>
				</ScrollView>
			</View>
		</>
	);
};

const Card = ({ image, location }) => (
	<View style={styles.card}>
		<Image source={image} style={styles.image} />
		<Text style={styles.locationText}>{location}</Text>
	</View>
);

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
		height: 150,
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
		height: "70%",
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
});
