// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBY5fJh3LBic687z8g8q3LCwBM4kAHdQNY",
  authDomain: "dashboard-project-37267.firebaseapp.com",
  projectId: "dashboard-project-37267",
  storageBucket: "dashboard-project-37267.firebasestorage.app",
  messagingSenderId: "899913835846",
  appId: "1:899913835846:web:c86afb80185692b00fb147",
  measurementId: "G-33CS6SLPY4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
