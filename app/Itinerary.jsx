import React from "react";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	ImageBackground,
	Dimensions,
	ScrollView,
	Image,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, Stack, useRouter } from "expo-router";
import Home from "./index";
import Logo from "../assets/images/Logo2.png";

const { width, height } = Dimensions.get("window");

const Itinerary = () => {
	const { image, location } = useLocalSearchParams();
	const router = useRouter();

	const activities = [
		{
			day: 1,
			title: "Arrival & Orientation",
			activities: [
				{ time: "9:00 AM", activity: "Check-in at Hotel", icon: "home" },
				{ time: "11:00 AM", activity: "Local Area Tour", icon: "map" },
				{ time: "2:00 PM", activity: "Welcome Lunch", icon: "coffee" },
				{ time: "4:00 PM", activity: "City Exploration", icon: "compass" },
			],
		},
		{
			day: 2,
			title: "Adventure Day",
			activities: [
				{ time: "8:00 AM", activity: "Breakfast", icon: "coffee" },
				{ time: "10:00 AM", activity: "Hiking Trip", icon: "trending-up" },
				{ time: "2:00 PM", activity: "Local Cuisine", icon: "coffee" },
				{ time: "5:00 PM", activity: "Sunset Views", icon: "sun" },
			],
		},
		{
			day: 3,
			title: "Cultural Experience",
			activities: [
				{ time: "9:00 AM", activity: "Museum Visit", icon: "book" },
				{ time: "12:00 PM", activity: "Local Market", icon: "shopping-bag" },
				{ time: "3:00 PM", activity: "Cooking Class", icon: "coffee" },
				{ time: "7:00 PM", activity: "Traditional Show", icon: "music" },
			],
		},
	];
	const handleXPress = () => {
		router.replace({ pathname: "/post", params: { image, location } });
	};
	const handleSave = () => {
		router.push("/saved");
	};

	return (
		<>
			<Stack.Screen options={{ headerShown: false }} />
			{/* Logo at the top right */}
			<Image source={Logo} style={styles.logo} resizeMode="contain" />
			<View style={styles.container}>
				<ImageBackground
					source={{ uri: image }}
					style={styles.backgroundImage}
					resizeMode="cover"
				>
					<View style={styles.overlay} />
					<View style={styles.header}>
						<TouchableOpacity onPress={handleXPress}>
							<Feather name="x" size={24} color="#FFFFFF" />
						</TouchableOpacity>
						<Text style={styles.headerTitle}>Your {location} Adventure</Text>
						<View style={{ width: 24 }} />
					</View>

					<ScrollView
						style={styles.content}
						showsVerticalScrollIndicator={false}
					>
						{activities.map((day, index) => (
							<View key={index} style={styles.dayContainer}>
								<View style={styles.dayHeader}>
									<Text style={styles.dayTitle}>Day {day.day}</Text>
									<Text style={styles.daySubtitle}>{day.title}</Text>
								</View>
								{day.activities.map((item, actIndex) => (
									<View key={actIndex} style={styles.activityItem}>
										<View style={styles.timeContainer}>
											<Text style={styles.timeText}>{item.time}</Text>
										</View>
										<View style={styles.activityContent}>
											<View style={styles.iconContainer}>
												<Feather name={item.icon} size={20} color="#FFFFFF" />
											</View>
											<Text style={styles.activityText}>{item.activity}</Text>
										</View>
									</View>
								))}
							</View>
						))}
						{/*SAVE*/}
						<TouchableOpacity onPress={handleSave}>
							<View style={styles.saveContainer}>
								<Text style={styles.saveButton}>SAVE!</Text>
								<View style={styles.saveButtonIcon}>
									<Feather name="arrow-right" size={20} color="#386BF6" />
								</View>
							</View>
						</TouchableOpacity>
						<View style={styles.bottomSpacing} />
					</ScrollView>
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
	logo: {
		position: "absolute",
		top: 50,
		right: 20,
		width: 55,
		height: 55,
		zIndex: 0, // make z index 1 to show the logo else 0 to hide
		borderRadius: 50,
	},
	backgroundImage: {
		flex: 1,
		width: "100%",
		height: "100%",
	},
	overlay: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: "rgba(0, 0, 0, 0.65)",
	},
	content: {
		flex: 1,
		padding: 20,
		zIndex: 1,
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: 20,
		paddingTop: 60,
		zIndex: 1,
	},
	headerTitle: {
		fontFamily: "Poppins",
		fontSize: 20,
		fontWeight: "600",
		color: "#FFFFFF",
	},
	content: {
		flex: 1,
		padding: 20,
	},
	dayContainer: {
		marginBottom: 30,
		backgroundColor: "rgba(0, 0, 0, 0.3)",
		borderRadius: 20,
		padding: 20,
	},
	dayHeader: {
		marginBottom: 20,
	},
	dayTitle: {
		fontFamily: "Poppins",
		fontSize: 24,
		fontWeight: "700",
		color: "#FFFFFF",
	},
	daySubtitle: {
		fontFamily: "Poppins",
		fontSize: 16,
		color: "#386BF6",
		marginTop: 5,
	},
	activityItem: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 15,
	},
	timeContainer: {
		width: 80,
		marginRight: 15,
	},
	timeText: {
		fontFamily: "Actor",
		fontSize: 14,
		color: "white",
		fontWeight: "900",
	},
	activityContent: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "rgba(56, 107, 246, 0.2)",
		padding: 15,
		borderRadius: 12,
	},
	iconContainer: {
		width: 36,
		height: 36,
		borderRadius: 18,
		backgroundColor: "#386BF6",
		justifyContent: "center",
		alignItems: "center",
		marginRight: 12,
	},
	activityText: {
		fontFamily: "Poppins",
		fontSize: 14,
		color: "#FFFFFF",
		flex: 1,
	},
	bottomSpacing: {
		height: 100,
	},
	saveContainer: {
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
	saveButton: {
		fontFamily: "Poppins",
		fontSize: 16,
		fontWeight: "700",
		color: "#386BF6",
		marginRight: 8,
		zIndex: 1,
	},
	saveButtonIcon: {
		backgroundColor: "rgba(56, 107, 246, 0.1)",
		width: 24,
		height: 24,
		borderRadius: 12,
		justifyContent: "center",
		alignItems: "center",
	},
});

export default Itinerary;
