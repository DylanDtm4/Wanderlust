import React, { useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	ScrollView,
	SafeAreaView,
} from "react-native";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { getAuth } from "firebase/auth";

const NextCreate = () => {
	const uploadToCloudinary = async (localUri) => {
		const data = new FormData();

		data.append("file", {
			uri: localUri,
			type: "image/jpeg",
			name: "upload.jpg",
		});
		data.append("upload_preset", "ml_default");

		try {
			const res = await fetch(
				"https://api.cloudinary.com/v1_1/doynqhkzz/image/upload",
				{
					method: "POST",
					body: data,
				}
			);

			const result = await res.json();
			return result.secure_url; // or result.url
		} catch (err) {
			console.error("Cloudinary upload error:", err);
			alert("Image upload failed.");
		}
	};

	const { picture } = useLocalSearchParams();

	const router = useRouter();
	const [formData, setFormData] = useState({
		title: "",
		location: "",
		city: "",
		bestTime: "",
		duration: "",
		lowerBudget: "",
		upperBudget: "",
		activities: "",
		description: "",
	});

	const allFieldsFilled = Object.values(formData).every(
		(field) => field.trim() !== ""
	);

	const handlePost = async () => {
		try {
			const auth = getAuth();
			const user = auth.currentUser;

			if (!user) {
				throw new Error("User is not logged in.");
			}

			// Step 1: Get the username from the backend using userID
			const response = await fetch(
				`https://mint-adder-awake.ngrok-free.app/user/username/${user.uid}`
			);

			if (!response.ok) {
				throw new Error("Failed to retrieve username");
			}

			const data = await response.json();
			const username = data.username;

			// Step 2: Upload image to Cloudinary
			const imageUrl = await uploadToCloudinary(picture);
			if (!imageUrl) throw new Error("Failed to upload image to Cloudinary");

			// Step 3: Post the data to your backend MongoDB
			const postResponse = await fetch(
				"https://mint-adder-awake.ngrok-free.app/create/post", // Remember to fix the URL
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						userID: user.uid,
						username: username,
						picture: imageUrl,
						title: formData.title,
						location: formData.location,
						city: formData.city,
						bestTime: formData.bestTime,
						duration: formData.duration,
						lowerBudget: formData.lowerBudget,
						upperBudget: formData.upperBudget,
						activities: formData.activities,
						description: formData.description,
					}),
				}
			);

			if (!postResponse.ok) throw new Error("Failed to create post in DB");

			setFormData({
				title: "",
				location: "",
				city: "",
				bestTime: "",
				duration: "",
				lowerBudget: "",
				upperBudget: "",
				activities: "",
				description: "",
			});
			router.push("/");
			alert("Post created successfully!");
		} catch (err) {
			console.error("Post error:", err);
			alert("Error creating post: " + err.message);
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<Stack.Screen
				options={{
					headerTitle: "Create Post",
					headerStyle: {
						backgroundColor: "#1E1E1E",
					},
					headerTintColor: "#FFFFFF",
					headerShadowVisible: false,
					headerLeft: () => (
						<TouchableOpacity
							onPress={() => router.back()}
							style={styles.backButton}
						>
							<Feather name="arrow-left" size={24} color="#FFFFFF" />
						</TouchableOpacity>
					),
				}}
			/>

			<ScrollView style={styles.scrollView}>
				<View style={styles.formContainer}>
					{/* Title Input */}
					<View style={styles.inputGroup}>
						<Text style={styles.label}>Title</Text>
						<TextInput
							style={styles.input}
							placeholder="Enter title"
							placeholderTextColor="#666"
							value={formData.title}
							onChangeText={(text) => setFormData({ ...formData, title: text })}
						/>
					</View>

					{/* Location Inputs */}
					<View style={styles.inputGroup}>
						<Text style={styles.label}>Location</Text>
						<TextInput
							style={styles.input}
							placeholder="Enter location"
							placeholderTextColor="#666"
							value={formData.location}
							onChangeText={(text) =>
								setFormData({ ...formData, location: text })
							}
						/>
					</View>

					<View style={styles.inputGroup}>
						<Text style={styles.label}>City</Text>
						<TextInput
							style={styles.input}
							placeholder="Enter city"
							placeholderTextColor="#666"
							value={formData.city}
							onChangeText={(text) => setFormData({ ...formData, city: text })}
						/>
					</View>

					{/* Trip Details */}
					<View style={styles.inputGroup}>
						<Text style={styles.label}>Best Time to Visit</Text>
						<TextInput
							style={styles.input}
							placeholder="e.g., December - March"
							placeholderTextColor="#666"
							value={formData.bestTime}
							onChangeText={(text) =>
								setFormData({ ...formData, bestTime: text })
							}
						/>
					</View>

					<View style={styles.inputGroup}>
						<Text style={styles.label}>Duration</Text>
						<TextInput
							style={styles.input}
							placeholder="e.g., 5-7 Days"
							placeholderTextColor="#666"
							value={formData.duration}
							onChangeText={(text) =>
								setFormData({ ...formData, duration: text })
							}
						/>
					</View>

					{/* Budget Range */}
					<View style={styles.rowContainer}>
						<View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
							<Text style={styles.label}>Lower Budget</Text>
							<TextInput
								style={styles.input}
								placeholder="$"
								placeholderTextColor="#666"
								keyboardType="numeric"
								value={formData.lowerBudget}
								onChangeText={(text) =>
									setFormData({ ...formData, lowerBudget: text })
								}
							/>
						</View>
						<View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
							<Text style={styles.label}>Upper Budget</Text>
							<TextInput
								style={styles.input}
								placeholder="$"
								placeholderTextColor="#666"
								keyboardType="numeric"
								value={formData.upperBudget}
								onChangeText={(text) =>
									setFormData({ ...formData, upperBudget: text })
								}
							/>
						</View>
					</View>

					<View style={styles.inputGroup}>
						<Text style={styles.label}>Activities</Text>
						<TextInput
							style={styles.input}
							placeholder="e.g., Skiing, Hiking"
							placeholderTextColor="#666"
							value={formData.activities}
							onChangeText={(text) =>
								setFormData({ ...formData, activities: text })
							}
						/>
					</View>

					<View style={styles.inputGroup}>
						<Text style={styles.label}>Description</Text>
						<TextInput
							style={[styles.input, styles.textArea]}
							placeholder="Tell us about your experience..."
							placeholderTextColor="#666"
							multiline
							numberOfLines={4}
							value={formData.description}
							onChangeText={(text) =>
								setFormData({ ...formData, description: text })
							}
						/>
					</View>
				</View>
				<TouchableOpacity
					style={[styles.postButton, { opacity: allFieldsFilled ? 1 : 0.5 }]}
					onPress={handlePost}
					disabled={!allFieldsFilled}
				>
					<Text style={styles.postButtonText}>Post</Text>
				</TouchableOpacity>
			</ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#1E1E1E",
	},
	backButton: {
		marginLeft: 16,
	},
	scrollView: {
		flex: 1,
	},
	formContainer: {
		padding: 16,
	},
	inputGroup: {
		marginBottom: 20,
	},
	label: {
		color: "#FFFFFF",
		fontSize: 16,
		fontFamily: "Poppins",
		marginBottom: 8,
	},
	input: {
		backgroundColor: "#2A2A2A",
		borderRadius: 12,
		padding: 12,
		color: "#FFFFFF",
		fontFamily: "Poppins",
		fontSize: 16,
	},
	textArea: {
		height: 120,
		textAlignVertical: "top",
	},
	rowContainer: {
		flexDirection: "row",
		marginBottom: 20,
	},
	postButton: {
		backgroundColor: "#386BF6",
		margin: 16,
		marginBottom: 150,
		padding: 16,
		borderRadius: 12,
		alignItems: "center",
	},
	postButtonText: {
		color: "#FFFFFF",
		fontSize: 18,
		fontFamily: "Poppins",
		fontWeight: "600",
	},
});

export default NextCreate;
