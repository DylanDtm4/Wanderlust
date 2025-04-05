import { auth } from "../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	Image,
} from "react-native";
import { useRouter } from "expo-router";
import GoogleIcon from "../assets/images/Google logo.png";
import Logo from "../assets/images/Logo2.png";
import Signup from "./signup";

import { Feather } from "@expo/vector-icons";

const LoginScreen = ({ setIsAuthenticated }) => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	const router = useRouter(); // Use router

	const handleLogin = async () => {
		try {
			await signInWithEmailAndPassword(auth, username, password);
			console.log("Email login success");
			setIsAuthenticated(true);
		} catch (err) {
			console.log("Login failed:", err.message);
			alert("Invalid credentials");
		}
	};

	const handleSignUp = () => {
		router.push("/signup"); // this takes you to the signup page
	};

	return (
		<View style={styles.container}>
			{/* Logo at the top right */}
			<Image source={Logo} style={styles.logo} resizeMode="contain" />

			<Text style={styles.title}>Login</Text>

			<View style={styles.inputContainer}>
				<Text style={styles.label}>Email address</Text>
				<View style={styles.inputWrapper}>
					<TextInput
						style={styles.inputField}
						placeholder="example@gmail.com"
						placeholderTextColor="#666"
						value={username}
						onChangeText={setUsername}
						keyboardType="email-address"
						autoCapitalize="none"
						color="black"
					/>
					<Feather
						name="check-circle"
						size={20}
						color="#666"
						style={styles.inputIcon}
					/>
				</View>
			</View>

			<View style={styles.inputContainer}>
				<Text style={styles.label}>Password</Text>
				<View style={styles.inputWrapper}>
					<TextInput
						style={styles.inputField}
						placeholder="Enter your password"
						placeholderTextColor="#666"
						secureTextEntry={!showPassword}
						value={password}
						onChangeText={setPassword}
					/>
					<TouchableOpacity
						onPress={() => setShowPassword(!showPassword)}
						style={styles.inputIcon}
					>
						<Feather
							name={showPassword ? "eye" : "eye-off"}
							size={20}
							color="#666"
						/>
					</TouchableOpacity>
				</View>
			</View>

			<TouchableOpacity onPress={() => alert("Forgot Password?")}>
				<Text style={styles.forgotPassword}>Forgot password?</Text>
			</TouchableOpacity>

			<TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
				<Text style={styles.loginText}>Log In</Text>
			</TouchableOpacity>

			<Text style={styles.orText}>Or Login with</Text>
			<View style={styles.divider} />

			<TouchableOpacity style={styles.googleButton}>
				<Image
					source={GoogleIcon}
					style={styles.googleIcon}
					resizeMode="contain"
				/>
			</TouchableOpacity>

			<TouchableOpacity onPress={handleSignUp} style={styles.signupContainer}>
				<Text style={styles.signupText}>Don't have an account? </Text>
				<Text style={styles.signupLink}>Sign up</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		backgroundColor: "#FFFFFF",
		padding: 50,
	},
	logo: {
		position: "absolute",
		top: 60,
		right: 20,
		width: 100,
		height: 100,
	},
	title: {
		fontSize: 30,
		fontWeight: "700",
		marginBottom: 50,
	},
	inputContainer: {
		width: "100%",
		marginBottom: 30,
	},
	label: {
		fontSize: 14,
		marginBottom: 10,
	},
	inputWrapper: {
		flexDirection: "row",
		alignItems: "center",
		borderWidth: 1,
		borderColor: "#D8DADC",
		borderRadius: 10,
		backgroundColor: "#FFFFFF",
		paddingRight: 15,
	},
	inputField: {
		flex: 1,
		padding: 18,
		fontSize: 16,
		color: "black",
	},
	inputIcon: {
		padding: 5,
	},
	forgotPassword: {
		fontSize: 14,
		color: "#386BF6",
		alignSelf: "flex-end",
	},
	loginButton: {
		width: "100%",
		padding: 17,
		backgroundColor: "#000000",
		borderRadius: 10,
		alignItems: "center",
		marginTop: 20,
	},
	loginText: {
		fontSize: 16,
		fontWeight: "600",
		color: "#FFFFFF",
	},
	orText: {
		fontSize: 14,
		color: "rgba(0, 0, 0, 0.7)",
		marginTop: 30,
		alignItems: "center",
		justifyContent: "center",
	},
	divider: {
		width: "100%",
		height: 1,
		backgroundColor: "#D8DADC",
		marginVertical: 10,
		alignItems: "center",
	},
	googleButton: {
		width: "100%",
		padding: 18,
		borderWidth: 1,
		borderColor: "#D8DADC",
		borderRadius: 10,
		alignItems: "center",
		justifyContent: "center",
		marginTop: 10,
		height: 60,
	},
	googleIcon: {
		width: 24,
		height: 24,
	},
	signupContainer: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		marginTop: 20,
		marginBottom: 50,
	},
	signupText: {
		fontSize: 14,
		color: "#666666",
	},
	signupLink: {
		fontSize: 14,
		color: "#386BF6",
		fontWeight: "700",
	},
});

export default LoginScreen;
