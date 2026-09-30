// ==========================================================================
// Central Firebase Initialization (Server Concept)
// Single Source of Truth for Govindasamy & Co Database & Storage
// ==========================================================================
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import dotenv from "dotenv";

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID || process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID || process.env.VITE_FIREBASE_MEASUREMENT_ID
};

function validateConfig(config) {
  const missing = [];
  if (!config.apiKey) missing.push("FIREBASE_API_KEY");
  if (!config.projectId) missing.push("FIREBASE_PROJECT_ID");
  if (!config.authDomain) missing.push("FIREBASE_AUTH_DOMAIN");
  if (missing.length > 0) {
    console.warn(
      `⚠️ [Server Firebase Warning] Missing environment keys in .env:\n` +
      missing.map((k) => `   - ${k}`).join("\n") +
      `\nPlease ensure your Firebase project credentials are set in surya-tex-server/.env.`
    );
  }
}
validateConfig(firebaseConfig);

// Initialize Central Firebase App
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
