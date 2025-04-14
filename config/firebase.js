import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
	apiKey: Constants.expoConfig.extra.firebaseApiKey,
	authDomain: Constants.expoConfig.extra.firebaseAuthDomain,
	projectId: Constants.expoConfig.extra.firebaseProjectId,
	storageBucket: Constants.expoConfig.extra.firebaseStorageBucket,
	messagingSenderId: Constants.expoConfig.extra.firebaseMessagingSenderId,
	appId: Constants.expoConfig.extra.firebaseAppId,
	measurementId: Constants.expoConfig.extra.firebaseMeasurementId,
};

// Initialize Firebase
console.log("API Key:", Constants.expoConfig.extra.firebaseApiKey);

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
	persistence: getReactNativePersistence(AsyncStorage),
});
const db = getFirestore(app);

export { auth, db };
