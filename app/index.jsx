import React, { useState } from "react";
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

const popularLocations = [
	{
		id: 1,
		name: "Santorini",
		city: "Cyclades, Greece",
		author: "Alice Johnson",
		image: {
			uri: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=100",
		},
		rating: "4.9",
		description: "Iconic white-washed buildings with blue domes",
	},
	{
		id: 2,
		name: "Machu Picchu",
		city: "Cusco Region, Peru",
		author: "John Smith",
		image: {
			uri: "https://images.unsplash.com/photo-1518684079-3c830dcef090?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=100",
		},
		rating: "4.9",
		description: "Ancient Incan citadel in the Andes Mountains",
	},
	{
		id: 3,
		name: "Taj Mahal",
		city: "Agra, India",
		author: "Tammy Kean",
		image: {
			uri: "https://images.unsplash.com/photo-1548013146-72479768bada?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=100",
		},
		rating: "4.8",
		description: "Magnificent marble mausoleum and UNESCO site",
	},
	{
		id: 5,
		name: "Mount Fuji",
		city: "Honshu, Japan",
		author: "Noah Kim",
		image: {
			uri: "https://images.unsplash.com/photo-1522083165195-3424ed129620?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=100",
		},
		rating: "4.8",
		description: "Japan's highest mountain and iconic symbol",
	},
	{
		id: 6,
		name: "Bali Rice Terraces",
		city: "Ubud, Indonesia",
		author: "Ryan Rui",
		image: {
			uri: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=100",
		},
		rating: "4.7",
		description: "Stunning emerald-green rice paddies",
	},
	{
		id: 7,
		name: "Colosseum",
		city: "Rome, Italy",
		author: "Joseph Jayden",
		image: {
			uri: "https://images.unsplash.com/photo-1555921015-5532091f6026?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=100",
		},
		rating: "4.8",
		description: "Ancient Roman amphitheater and iconic landmark",
	},
].map((location) => ({
	...location,
	likes: Math.floor(Math.random() * 10000) + 1000,
	comments: [],
	votes: Math.floor(Math.random() * 1000),
	isLiked: false,
}));

const Home = () => {
	const router = useRouter();
	const [locations, setLocations] = useState(popularLocations);
	const [activeComment, setActiveComment] = useState(null);
	//const [color, setLikeColor] =

	const handleSignUp = () => {
		router.push("/signup");
	};
	const handleSurprise = () => {
		router.push("surprise");
	};

	const handleCardPress = (image, location, author, city) => {
		router.push({
			pathname: "/post",
			params: { image, location, author, city },
		});
	};
	const handleChatbotPress = () => {
		router.push("/chatbot");
	};
	const [liked, setLiked] = useState({});
	const [likeBg, setlikeBg] = useState({});

	const handleLike = (id) => {
		setLiked((prevLiked) => ({
			...prevLiked,
			[id]: !prevLiked[id], // Toggle like status for each location
		}));
	};

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
					<Text style={styles.searchText}>Find things to do</Text>
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
						{locations.map((location) => (
							<TouchableOpacity
								key={location.id}
								style={styles.exploreCard}
								onPress={() =>
									handleCardPress(
										location.image.uri,
										location.name,
										location.author,
										location.city
									)
								}
							>
								<Image
									source={location.image}
									style={styles.image}
									resizeMode="cover"
								/>
								<TouchableOpacity
									style={[
										styles.heartButton,
										{
											backgroundColor: liked[location.id]
												? "white"
												: "rgba(0, 0, 0, 0.4)",
										}, // Change background color
									]}
									onPress={() => handleLike(location.id)}
								>
									<Feather
										name="heart"
										size={25}
										color={liked[location.id] ? "red" : "white"} // Change color dynamically
									/>
								</TouchableOpacity>

								<View style={styles.cardContent}>
									<Text style={styles.locationText}>{location.name}</Text>
									<View style={styles.cardFooter}>
										<Text style={styles.cityText}>{location.city}</Text>
										<Text style={styles.rating}>{location.rating} ★</Text>
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
	searchText: {
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
		backgroundColor: "rgba(0, 0, 0, 0.4)",
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
});

export default Home;
