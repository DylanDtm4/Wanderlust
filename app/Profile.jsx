import React from "react";
import { useRouter, Stack } from "expo-router";
import {
	View,
	Text,
	StyleSheet,
	Image,
	TouchableOpacity,
	ScrollView,
} from "react-native";
import EditProfileScreen from "../app/EditProfileScreen";
import { Ionicons } from "@expo/vector-icons";
import profile1 from "../assets/images/profile1.jpg";
import fuji from "../assets/images/fuji.png";
import paris from "../assets/images/paris.png";
import profile6 from "../assets/images/profile6.jpg";
import profile7 from "../assets/images/profile7.webp";
import profile4 from "../assets/images/profile4.webp";
import gridPosts from "../assets/images/gridIcon.png";

const Profile = () => {
	const router = useRouter();

	const handleAddCardPress = () => {
		router.push("/create"); // Navigate to the 'create' route
	};

	return (
		<>
			{/* This hides the header */}
			<Stack.Screen options={{ headerShown: false }} />
			<View style={styles.container}>
				{/* Profile Info Section */}
				<View style={styles.username}>
					<Text style={styles.name}>john_doe</Text>
				</View>

				<View style={styles.topContainer}>
					<Image source={profile1} style={styles.profileImage} />
					{/* Stats Section */}
					<View style={styles.statsContainer}>
						<View style={styles.statItem}>
							<Text style={styles.statNumber}>54</Text>
							<Text style={[styles.statLabel]}>Posts</Text>
						</View>
						<View style={styles.statItem}>
							<Text style={styles.statNumber}>834</Text>
							<Text style={[styles.statLabel]}>Followers</Text>
						</View>
						<View style={styles.statItem}>
							<Text style={styles.statNumber}>162</Text>
							<Text style={[styles.statLabel]}>Following</Text>
						</View>
					</View>
				</View>

				{/* 3rd section - bio, edit button */}
				<View style={styles.profileInfo}>
					<View style={styles.nameBioContainer}>
						<Text style={[styles.name, { fontWeight: "bold" }]}>John Doe</Text>
						<Text style={styles.name}>Travel blogs in Texas</Text>
						<Text style={styles.name}>Follow me for an adventure</Text>
					</View>
					<TouchableOpacity
						style={styles.editButton}
						onPress={() => router.push("/EditProfileScreen")}
					>
						<Text style={styles.editButtonText}>Edit</Text>
					</TouchableOpacity>
				</View>

				<View style={styles.gridIcon}>
					<Image source={gridPosts} style={styles.gridPosts} />
				</View>

				{/* Solid line */}
				<View style={styles.solidLine} />

				<ScrollView
					contentContainerStyle={[styles.gridContainer, { marginTop: 15 }]}
				>
					<View style={styles.row}>
						<View style={styles.card}>
							<Image source={fuji} style={styles.image} />
							<Text style={styles.locationText}>Fuji, Tokyo</Text>
						</View>
						<View style={styles.card}>
							<Image source={profile6} style={styles.image} />
							<Text style={styles.locationText}>Aspen, CO</Text>
						</View>
					</View>
					<View style={styles.row}>
						<View style={styles.card}>
							<Image source={profile7} style={styles.image} />
							<Text style={styles.locationText}>Toronto, ON</Text>
						</View>
						<View style={styles.card}>
							<Image source={paris} style={styles.image} />
							<Text style={styles.locationText}>Paris, France</Text>
						</View>
					</View>
					<View style={styles.row}>
						<View style={styles.card}>
							<Image source={profile4} style={styles.image} />
							<Text style={styles.locationText}>Beijing, China</Text>
						</View>
						<TouchableOpacity
							style={styles.addCard}
							onPress={handleAddCardPress}
						>
							{/* Add Button */}
							<View style={styles.addButton}>
								<Ionicons name="add-circle" size={40} color="#386BF6" />
							</View>
							<Text style={styles.locationText}>City, State</Text>
						</TouchableOpacity>
					</View>
				</ScrollView>
			</View>
		</>
	);
};

export default Profile;

const styles = StyleSheet.create({
	gridIcon: {
		alignItems: "center",
	},
	image: {
		flex: 1,
		width: "100%",
		resizeMode: "cover",
	},
	locationText: {
		textAlign: "center",
		padding: 8,
		fontSize: 14,
		color: "#666",
	},
	row: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 10,
	},
	card: {
		width: 150,
		height: 120,
		backgroundColor: "white",
		borderRadius: 12,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
		overflow: "hidden",
		marginHorizontal: 20,
	},
	addCard: {
		width: 150,
		height: 120,
		backgroundColor: "white",
		borderRadius: 12,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
		overflow: "hidden",
		marginHorizontal: 20,
		justifyContent: "center",
		alignItems: "center",
	},
	container: {
		flex: 1,
		backgroundColor: "#FFFFFF",
	},
	gridContainer: {
		padding: 10,
	},
	username: {
		alignItems: "center",
		marginTop: 25,
	},
	topContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 20,
		paddingLeft: 20,
	},
	profileInfo: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	profileImage: {
		width: 96,
		height: 96,
		borderRadius: 48,
		borderWidth: 3.5,
		borderColor: "#C7C7CC",
		resizeMode: "cover",
	},
	editButton: {
		width: 150,
		marginRight: 20,
		height: 29,
		backgroundColor: "#FFFFFF",
		borderWidth: 1,
		borderColor: "rgba(60, 60, 67, 0.18)",
		borderRadius: 6,
		justifyContent: "center",
		alignItems: "center",
	},
	editButtonText: {
		fontFamily: "Poppins",
		fontSize: 13,
		fontWeight: "bold",
		color: "#262626",
	},
	statsContainer: {
		flexDirection: "row",
		justifyContent: "space-around",
		paddingHorizontal: 30,
		marginTop: 20,
	},
	statItem: {
		alignItems: "center",
	},
	statNumber: {
		fontFamily: "Poppins",
		fontSize: 16,
		fontWeight: "bold",
		color: "#262626",
		marginRight: 15,
	},
	statLabel: {
		fontFamily: "Actor",
		fontSize: 13,
		color: "#262626",
		marginRight: 15,
	},
	nameBioContainer: {
		padding: 10,
		marginLeft: 20,
	},
	name: {
		fontFamily: "Poppins",
		fontSize: 12,
		fontWeight: "600",
		color: "#262626",
		marginBottom: 5,
	},
	bio: {
		fontFamily: "Actor",
		fontSize: 12,
		color: "#262626",
	},
	addButton: {
		marginBottom: 5,
		alignItems: "center",
	},
	solidLine: {
		marginTop: 25,
		height: 2,
		backgroundColor: "#C7C7CC",
		marginHorizontal: 20,
	},
});
