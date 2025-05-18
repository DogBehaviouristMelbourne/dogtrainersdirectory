import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDZCW7J24zrQCe3OCpelOnXe_bGnVn9Atk",
  authDomain: "dog-trainers-directory.firebaseapp.com",
  projectId: "dog-trainers-directory",
  storageBucket: "dog-trainers-directory.appspot.com",
  messagingSenderId: "175653426025",
  appId: "1:175653426025:web:39e5733c04698db58e63f8"
};

// Initialize Firebase services
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

// Google Maps API key
export const GOOGLE_MAPS_API_KEY = "AIzaSyDeUlwYc62p6hRTXmnEqb-d7P-o1iWCaQc";

// Domain settings
export const SITE_DOMAIN = "dogtrainersdirectory.com.au";

// Export Firebase services
export { auth, storage };
export default db;
