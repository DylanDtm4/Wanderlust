const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });
export default {
	expo: {
		name: "wanderlust",
		slug: "wanderlust",
		version: "1.0.0",
		extra: {
			firebaseApiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
			firebaseAuthDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
			firebaseProjectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
			firebaseStorageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
			firebaseMessagingSenderId:
				process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
			firebaseAppId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
			firebaseMeasurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
		},
	},
};
