import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	StyleSheet,
	Image,
	TouchableOpacity,
	SafeAreaView,
	ScrollView,
	Modal,
	Dimensions,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

const { height } = Dimensions.get("window");

const Create = () => {
	const [image, setImage] = useState(null);

	const uploadImage = async (mode) => {
		try {
			const { status } =
				await ImagePicker.requestMediaLibraryPermissionsAsync();
			if (status !== "granted") {
				alert("Permission required to access media library.");
				return;
			}

			const result = await ImagePicker.launchImageLibraryAsync({
				allowsEditing: true,
				aspect: [1, 1],
				quality: 1,
			});

			if (!result.canceled) {
				const uri = result.assets[0].uri;
				setImage(uri);
			}
		} catch (err) {
			alert("Error uploading image: " + err.message);
		}
	};

	const router = useRouter();
	// Fix the handleExplore function
	const handleNext = async () => {
		if (!image) {
			alert("Please select an image first.");
			return;
		}

		router.push({
			pathname: "/nextCreate",
			params: { picture: image },
		});
		setImage(null);
	};

	return (
		<SafeAreaView style={styles.container}>
			<Stack.Screen options={{ headerShown: false }} />

			{/* Status Bar */}
			<View style={styles.statusBar}>
				<Text style={styles.time}></Text>
				<TouchableOpacity onPress={handleNext}>
					<Text style={styles.nextButton}>Next</Text>
				</TouchableOpacity>
			</View>

			{/* Main Image Container */}
			<View style={styles.imageContainer}>
				{image ? (
					<Image source={{ uri: image }} style={styles.mainImage} />
				) : (
					<View style={styles.mainImage}>
						<Text style={{ color: "#aaa", textAlign: "center", marginTop: 20 }}>
							No image selected
						</Text>
					</View>
				)}

				{/* Location Info Overlay 
        <View style={styles.locationOverlay}>
          <Text style={styles.cityState}>{selectedImage.location}</Text>
          <View style={styles.locationDetails}>
            <Feather name="map-pin" size={22} color="#CAC8C8" />
            <Text style={styles.stateCountry}>{selectedImage.location}</Text>
            <Text style={styles.rating}>4.8</Text>
          </View>
        </View>
      */}
			</View>
			{/* Gallery Button */}
			<TouchableOpacity
				style={styles.galleryButton}
				onPress={() => uploadImage("gallery")}
			>
				<Feather name="image" size={24} color="#FFFFFF" />
			</TouchableOpacity>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FFFFFF",
		position: "relative",
	},
	statusBar: {
		height: 44,
		backgroundColor: "#1E1E1E",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 20,
	},
	time: {
		fontFamily: "Alexandria",
		fontSize: 15,
		color: "#FFFFFF",
		letterSpacing: -0.3,
	},
	nextButton: {
		fontFamily: "Actor",
		fontSize: 16,
		color: "#3897F0",
		letterSpacing: -0.33,
	},
	imageContainer: {
		width: 396.5,
		height: 586.75,
		alignSelf: "center",
		marginTop: 80,
		borderRadius: 40.5,
		overflow: "hidden",
		position: "relative",
	},
	mainImage: {
		width: "100%",
		height: "100%",
		borderRadius: 40.5,
	},
	locationOverlay: {
		position: "absolute",
		bottom: 20,
		left: 20,
		right: 20,
		height: 101.25,
		backgroundColor: "rgba(29, 29, 29, 0.4)",
		borderRadius: 20.25,
		padding: 15,
		backdropFilter: "blur(27px)",
	},
	cityState: {
		fontFamily: "Poppins",
		fontSize: 21.6,
		fontWeight: "500",
		color: "#FFFFFF",
		marginBottom: 10,
	},
	locationDetails: {
		flexDirection: "row",
		alignItems: "center",
		marginTop: 10,
	},
	stateCountry: {
		fontFamily: "Actor",
		fontSize: 18.9,
		color: "#CAC8C8",
		marginLeft: 10,
	},
	rating: {
		fontFamily: "Poppins",
		fontSize: 18.9,
		color: "#CAC8C8",
		position: "absolute",
		right: 10,
	},
	galleryButton: {
		position: "absolute",
		bottom: 120,
		right: 20,
		backgroundColor: "#386BF6",
		width: 60,
		height: 60,
		borderRadius: 30,
		justifyContent: "center",
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
		zIndex: 999,
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		justifyContent: "flex-end",
	},
	galleryContainer: {
		height: height * 0.6,
		backgroundColor: "#1E1E1E",
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		overflow: "hidden",
	},
	galleryHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: 16,
		backgroundColor: "#1E1E1E",
		borderBottomWidth: 1,
		borderBottomColor: "rgba(255,255,255,0.1)",
	},
	galleryTitle: {
		color: "#FFFFFF",
		fontSize: 17,
		fontWeight: "600",
	},
	cancelButton: {
		color: "#FFFFFF",
		fontSize: 16,
	},
	galleryScroll: {
		flex: 1,
		backgroundColor: "#1E1E1E",
	},
	dateSection: {
		marginBottom: 20,
		paddingHorizontal: 12,
	},
	dateHeader: {
		color: "#FFFFFF",
		fontSize: 15,
		fontWeight: "600",
		marginBottom: 12,
		marginLeft: 4,
		opacity: 0.8,
	},
	imagesGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 3,
	},
	galleryItem: {
		width: "42.5%",
		aspectRatio: 1,
		marginBottom: 3,
		borderRadius: 8,
		overflow: "hidden",
		backgroundColor: "#2C2C2C",
	},
	galleryImage: {
		width: "100%",
		height: "100%",
		resizeMode: "cover",
	},
	locationLabel: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: "rgba(0,0,0,0.7)",
		padding: 8,
		flexDirection: "row",
		alignItems: "center",
	},
	locationIcon: {
		marginRight: 4,
	},
	locationText: {
		color: "#FFFFFF",
		fontSize: 11,
		flex: 1,
	},
});

export default Create;
