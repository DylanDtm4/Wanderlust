import { auth, googleProvider } from "../config/firebase";
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signInWithPopup,
	signOut,
	updatePassword,
	sendPasswordResetEmail,
} from "firebase/auth";
import { useState } from "react";

export const Auth = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	console.log(auth?.currentUser?.email);

	const resetPassword = async (email) => {
		try {
			await sendPasswordResetEmail(auth, email);
			alert("Password reset email sent!");
		} catch (err) {
			console.error("Reset error:", err.message);
			alert(err.message);
		}
	};

	const changePassword = async (newPassword) => {
		try {
			const user = auth.currentUser;
			if (user) {
				await updatePassword(user, newPassword);
				alert("Password updated successfully!");
			} else {
				alert("User not logged in");
			}
		} catch (err) {
			console.log("Error updating password:", err.message);
			alert(err.message);
		}
	};

	const signUpNewUsers = async () => {
		try {
			await createUserWithEmailAndPassword(auth, email, password);
			console.log("created new user & email login success");
		} catch (err) {
			console.log(err);
		}
	};

	const signUpExistingUsers = async () => {
		try {
			await signInWithEmailAndPassword(auth, email, password);
			console.log("email login success");
		} catch (err) {
			console.log(err);
		}
	};

	const signInWithGoogle = async () => {
		try {
			await signInWithPopup(auth, googleProvider);
			console.log("popup login success");
		} catch (err) {
			console.log(err);
		}
	};

	const logout = async () => {
		try {
			await signOut(auth);
			console.log("logout success");
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<div>
			<input
				placeholder="Email..."
				onChange={(e) => setEmail(e.target.value)}
			/>
			<input
				placeholder="Password..."
				type="password"
				onChange={(e) => setPassword(e.target.value)}
			/>
			<button onClick={signIn}>Sign In</button>

			<button onClick={signInWithGoogle}>Sign In With Google</button>

			<button onClick={logout}>Logout</button>
		</div>
	);
};
